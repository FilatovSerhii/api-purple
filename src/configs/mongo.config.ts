import { TypegooseModuleOptions } from './../../node_modules/nestjs-typegoose/dist/typegoose-options.interface.d';
import { ConfigService } from '@nestjs/config';

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<TypegooseModuleOptions> => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
};

// const getMongoString = (configService: ConfigService) =>
//   'mongodb://' +
//   configService.get('MONGO_LOGIN') +
//   ':' +
//   configService.get('MONGO_PASSWORD') +
//   ':' +
//   configService.get('MONGO_HOST') +
//   ':' +
//   configService.get('MONGO_PORT') +
//   '/' +
//   configService.get('MONGO-AUTHDATABASE');

const getMongoOptions = () => ({
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const getMongoString = (configService: ConfigService) =>
  'mongodb://' +
  configService.get('MONGO_LOGIN') +
  ':' +
  configService.get('MONGO_PASSWORD') +
  '@' + // добавь @ для разделения логина и хоста
  configService.get('MONGO_HOST') +
  ':' +
  configService.get('MONGO_PORT') +
  '/' +
  configService.get('MONGO-AUTHDATABASE');
