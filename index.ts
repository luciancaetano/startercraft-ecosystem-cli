// Plop types are not imported, use any for NodePlopAPI
import componentGenerator from './generators/component/index';
import featureGenerator from './generators/feature/index';
import providerGenerator from './generators/provider/index';
import subcomponentGenerator from './generators/subcomponent/index';

export default function setupPlopGenerators(plop: any): void {
    plop.setGenerator('component', componentGenerator);
    plop.setGenerator('feature', featureGenerator);
    plop.setGenerator('provider', providerGenerator);
    plop.setGenerator('subcomponent', subcomponentGenerator);
}