import { NodePlopAPI } from "plop";


export default {
  description: 'Feature Structure Generator',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Feature name',
      validate: (value: string) => value.trim() ? true : 'Feature name is required',
      filter: (value: string) => `${value.trim()}-feature`,
    },
  ],
  actions: () => {
    const basePath = 'src/app/features/{{kebabCase name}}';
    const folders = [
      'components/elements',
      'components/layouts',
      'components/providers',
      'components/pages',
      'config',
      'types',
      'hooks',
      'utils',
    ];
  const folderActions = folders.map((folder) => ({
      type: 'add',
      path: `${basePath}/${folder}/.gitkeep`,
      templateFile: 'generators/feature/.gitkeep.hbs',
    }));
  const routeAction = {
      type: 'add',
      path: `${basePath}/routes/index.tsx`,
      templateFile: 'generators/feature/feature.routes.tsx.hbs',
    };
    return [...folderActions, routeAction];
  },
} as Partial<NodePlopAPI>;

