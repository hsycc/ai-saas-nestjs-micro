/*
 * @Author: hsycc
 * @Date: 2023-05-26 14:21:00
 * @LastEditTime: 2023-05-29 04:59:09
 * @Description:
 *
 */

import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import { NacosConfigService } from './nacos-config.service';
import {
  NacosConfigAsyncOptions,
  NacosConfigOptions,
  NacosConfigOptionsFactory,
} from '../common/interface';
import { NACOS_CONFIG_OPTIONS } from '../common/constants';

@Module({})
export class NacosConfigModule {
  public static forRoot(
    nacosConfigOptions: NacosConfigOptions,
    global = true,
  ): DynamicModule {
    return {
      global,
      module: NacosConfigModule,
      providers: [
        {
          provide: NACOS_CONFIG_OPTIONS,
          useValue: nacosConfigOptions,
        },
        Logger,
        NacosConfigService,
      ],
      exports: [NacosConfigService],
    };
  }

  public static forRootAsync(
    nacosConfigAsyncOptions: NacosConfigAsyncOptions,
  ): DynamicModule {
    return {
      global: nacosConfigAsyncOptions.global || false,
      module: NacosConfigModule,
      imports: nacosConfigAsyncOptions.imports || [],
      providers: [
        this.createNacosConfigAsyncProviders(nacosConfigAsyncOptions),
        NacosConfigService,
        Logger,
      ],
      exports: [NacosConfigService],
    };
  }

  private static createNacosConfigAsyncProviders(
    nacosConfigAsyncOptions: NacosConfigAsyncOptions,
  ): Provider {
    if (nacosConfigAsyncOptions.useFactory) {
      return {
        provide: NACOS_CONFIG_OPTIONS,
        useFactory: nacosConfigAsyncOptions.useFactory,
        inject: nacosConfigAsyncOptions.inject || [],
      };
    }

    // For useClass and useExisting...
    return {
      provide: NACOS_CONFIG_OPTIONS,
      useFactory: async (optionsFactory: NacosConfigOptionsFactory) =>
        await optionsFactory.createNacosConfigOptions(),
      inject: [
        nacosConfigAsyncOptions.useExisting || nacosConfigAsyncOptions.useClass,
      ],
    };
  }
}
