import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/db/entities/user-entity';
import { DataSource } from 'typeorm';

export const DbConnection = [
  {
    provide: 'DataSource',
    useFactory: async (configService: ConfigService) => {

      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: 'crud',
        entities: [UserEntity],
        logging: true,
        synchronize: true,
      });

      try {
        return await dataSource.initialize();
      } catch (error) {
        console.error('Error during Data Source initialization', error);
        throw error;
      }
    },
    inject: [ConfigService],
  },
];
