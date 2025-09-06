import fs from 'node:fs';
import path from 'node:path';
import { NodePlopAPI } from 'plop';


const featuresDir = path.resolve(process.cwd(), 'src/app/features');
const features: string[] = fs.readdirSync(featuresDir).filter((f) => f !== '.gitkeep');

export default {
  description: 'Provider Generator',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Provider name',
      validate: (value: string) => value.trim() ? true : 'Provider name is required',
      filter: (value: string) => `${value.trim()}-provider`,
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
    const basePath = !data.feature || data.feature === 'APP'
      ? 'src/app/components/providers'
      : 'src/app/features/{{feature}}/components/providers';
    const files = [
      { file: 'index.ts', template: 'index.ts.hbs' },
      { file: '{{kebabCase name}}.tsx', template: 'Component.tsx.hbs' },
      { file: '{{kebabCase name}}.types.ts', template: 'Component.types.ts.hbs' },
      { file: '{{kebabCase name}}.model.ts', template: 'Component.model.ts.hbs' },
      { file: '{{kebabCase name}}.spec.tsx', template: 'Component.spec.tsx.hbs' },
      { file: '{{kebabCase name}}.context.tsx', template: 'Component.context.tsx.hbs' },
    ];
    return files.map(({ file, template }) => ({
      type: 'add',
      path: `${basePath}/{{kebabCase name}}/${file}`,
      templateFile: `generators/provider/${template}`,
    }));
  },
} as Partial<NodePlopAPI>;