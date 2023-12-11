import { MappingElement } from "./config/models/config";

export interface ApiPreprocessor {
    process(input: any, mappingElement: MappingElement): any;
}
  