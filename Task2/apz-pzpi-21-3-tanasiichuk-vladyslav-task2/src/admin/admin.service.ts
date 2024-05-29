import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';

@Injectable()
export class AdminService {
  constructor(private configService: ConfigService) {}

  dbConfig = {
    host: 'localhost',
    port: '5432',
    user: this.configService.getOrThrow('POSTGRES_USER'),
    password: this.configService.getOrThrow('POSTGRES_PASSWORD'),
    database: this.configService.getOrThrow('POSTGRES_DB'),
  };

  public async exportDatabaseSQL(): Promise<string> {
    return new Promise((resolve, reject) => {
      const timestamp = new Date().toISOString().replace(/[-:]/g, '');

      const command = `pg_dump --no-owner --dbname=postgresql://${this.dbConfig.user}:${this.dbConfig.password}@${this.dbConfig.host}:${this.dbConfig.port}/${this.dbConfig.database} > backup_${timestamp}.sql`;
      exec(command, (error) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject('Database export failed');
        } else {
          console.log(`Database exported successfully`);
          resolve(`backup_${timestamp}.sql`);
        }
      });
    });
  }
}
