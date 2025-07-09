import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  getHello(): string {
    return 'Finance API is running! 🚀';
  }

  async getHealthCheck() {
    const isConnected = this.dataSource.isInitialized;

    // Debug das configurações
    const dbConfig = {
      host: this.configService.get('DATABASE_HOST'),
      port: this.configService.get('DATABASE_PORT'),
      username: this.configService.get('DATABASE_USER'),
      database: this.configService.get('DATABASE_NAME'),
      // Não loggar a senha por segurança
    };

    return {
      status: 'ok',
      database: isConnected ? 'connected' : 'disconnected',
      config: dbConfig,
      timestamp: new Date().toISOString(),
    };
  }
}
