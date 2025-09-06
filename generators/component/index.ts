import fs from 'node:fs';
import path from 'node:path';
import { NodePlopAPI } from 'plop';


const featuresDir = path.resolve(process.cwd(), 'src/app/features');
const features: string[] = fs.readdirSync(featuresDir).filter((f) => f !== '.gitkeep');

const componentTypePathsMap: Record<string, string> = {
  element: 'elements',
  layout: 'layouts',
  page: 'pages',
};

function applySuffix(name = '', type = ''): string {
  const normalizedType = type.toLowerCase().trim();
  if (normalizedType.endsWith('layout')) return `${name}-layout`;
  if (normalizedType.endsWith('page')) return `${name}-page`;
  return name;
}

function resolveBasePath(feature: string, componentType: string): string {
  const componentDir = componentTypePathsMap[componentType];
  if (!feature || feature === 'APP') {
    return `src/app/components/${componentDir}`;
  }
  return `src/app/features/{{feature}}/components/${componentDir}`;
}

export default {
  description: 'Component Generator',
  prompts: [
    {
      type: 'list',
      name: 'componentType',
      message: 'Select Component Type',
      choices: Object.keys(componentTypePathsMap),
    },
    {
      type: 'input',
      name: 'name',
      message: 'Component name',
      validate: (value: string) => value.trim() ? true : 'Component name is required',
      filter: (value: string, answers: any) => applySuffix(value, answers.componentType),
    },
    {
      type: 'list',
      name: 'feature',
      message: 'Select Feature',
      choices: ['APP', ...features],
      when: () => features.length > 0,
    },
  ],
  actions: (data: any) => {
    const { componentType, feature } = data;
    const basePath = resolveBasePath(feature, componentType);
    const isPage = componentType === 'page';
    const needsStyles = ['element', 'layout', 'page'].includes(componentType);
  const actions = [
      {
        type: 'add',
        path: `${basePath}/{{kebabCase name}}/index.ts`,
        templateFile: `generators/component/${isPage ? 'Page' : 'Component'}.index.ts.hbs`,
      },
      {
        type: 'add',
        path: `${basePath}/{{kebabCase name}}/{{kebabCase name}}.tsx`,
        templateFile: `generators/component/${isPage ? 'Page' : 'Component'}.tsx.hbs`,
      },
      {
        type: 'add',
        path: `${basePath}/{{kebabCase name}}/{{kebabCase name}}.types.ts`,
        templateFile: `generators/component/${isPage ? 'Page' : 'Component'}.types.ts.hbs`,
      },
      {
        type: 'add',
        path: `${basePath}/{{kebabCase name}}/{{kebabCase name}}.view-model.ts`,
        templateFile: 'generators/component/Component.view-model.ts.hbs',
      },
      {
        type: 'add',
        path: `${basePath}/{{kebabCase name}}/{{kebabCase name}}.spec.tsx`,
        templateFile: `generators/component/${isPage ? 'Page' : 'Component'}.spec.tsx.hbs`,
      },
    ];
    if (needsStyles) {
      actions.push({
        type: 'add',
        path: `${basePath}/{{kebabCase name}}/{{kebabCase name}}.module.scss`,
        templateFile: `generators/component/${isPage ? 'Page' : 'Component'}.module.scss.hbs`,
      });
    }
    return actions;
  },
} as Partial<NodePlopAPI>;

