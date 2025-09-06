import fs from 'node:fs';
import path from 'node:path';
import type { ActionType, NodePlopAPI } from 'plop';

const appDir = path.resolve(process.cwd(), 'src/app');
const featuresDir = path.join(appDir, 'features');

const componentTypePathsMap: Record<string, string> = {
  element: 'elements',
  layout: 'layouts',
  page: 'pages',
};

function listFeatures(): string[] {
  return fs.readdirSync(featuresDir).filter((f) => f !== '.gitkeep');
}

function listComponentsByType(feature: string, componentType: 'element' | 'layout' | 'page'): string[] {
  const baseDir =
    feature === 'APP'
      ? path.join(appDir, 'components', componentTypePathsMap[componentType])
      : path.join(featuresDir, feature, 'components', componentTypePathsMap[componentType]);
  return fs.existsSync(baseDir) ? fs.readdirSync(baseDir) : [];
}

export default {
    description: 'Generate a subcomponent inside a parent component',
    prompts: [
      {
        type: 'list',
        name: 'feature',
        message: 'Select the feature:',
        choices: ['APP', ...listFeatures()],
      },
      {
        type: 'list',
        name: 'componentType',
        message: 'Select the component type:',
        choices: Object.keys(componentTypePathsMap),
      },
      {
        type: 'list',
        name: 'parentComponent',
        message: 'Select the parent component:',
        choices: (answers: any) => listComponentsByType(answers.feature, answers.componentType),
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter the subcomponent name:',
        validate: (value: string) => value.trim() ? true : 'Subcomponent name is required',
      },
    ],
    actions: (data: any): ActionType[] => {
      const basePath =
        data.feature === 'APP'
          ? path.join(
              'src/app/components',
              componentTypePathsMap[data.componentType],
              '{{parentComponent}}/components/{{name}}'
            )
          : path.join(
              'src/app/features/{{feature}}/components',
              componentTypePathsMap[data.componentType],
              '{{parentComponent}}/components/{{name}}'
            );
      const files = [
        { file: '{{name}}.tsx', template: 'Component.tsx.hbs' },
        { file: '{{name}}.module.scss', template: 'Component.module.scss.hbs' },
        { file: '{{name}}.types.ts', template: 'Component.types.ts.hbs' },
        { file: '{{name}}.view-model.ts', template: 'Component.view-model.ts.hbs' },
        { file: 'index.ts', template: 'Component.index.ts.hbs' },
      ];
      return files.map(({ file, template }) => ({
        type: 'add',
        path: path.join(basePath, file),
        templateFile: `generators/component/${template}`,
      }));
    },
  } as Partial<NodePlopAPI>;