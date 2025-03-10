import { TypegooseModuleOptions } from './../../node_modules/nestjs-typegoose/dist/typegoose-options.interface.d';
import { ConfigService } from '@nestjs/config';
const getMongoString = (configService: ConfigService) =>
  configService.get<string>('MONGO_URI') || '';
const getMongoOptions = () => ({});

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<TypegooseModuleOptions> => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
};

