/*
 * @Author: hsycc
 * @Date: 2023-05-26 14:21:00
 * @LastEditTime: 2023-05-27 22:16:24
 * @Description:
 *
 */

import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import { NacosNamingService } from './nacos-naming.service';
import {
  NacosNamingAsyncOptions,
  NacosNamingOptions,
  NacosNamingOptionsFactory,
} from '../common/interface';
import { NACOS_NAMING_OPTIONS } from '../common/constants';

@Module({})
export class NacosNamingModule {
  public static forRoot(
    nacosNamingOptions: NacosNamingOptions,
    global = true,
  ): DynamicModule {
    return {
      global,
      module: NacosNamingModule,
      providers: [
        {
          provide: NACOS_NAMING_OPTIONS,
          useValue: nacosNamingOptions,
        },
        Logger,
        NacosNamingService,
      ],
      exports: [NacosNamingService],
    };
  }

  public static forRootAsync(
    nacosNamingAsyncOptions: NacosNamingAsyncOptions,
  ): DynamicModule {
    return {
      global: nacosNamingAsyncOptions.global || true,
      module: NacosNamingModule,
      imports: nacosNamingAsyncOptions.imports || [],
      providers: [
        this.createNacosNamingAsyncProviders(nacosNamingAsyncOptions),
        NacosNamingService,
        Logger,
      ],
      exports: [NacosNamingService],
    };
  }

  private static createNacosNamingAsyncProviders(
    nacosNamingAsyncOptions: NacosNamingAsyncOptions,
  ): Provider {
    if (nacosNamingAsyncOptions.useFactory) {
      return {
        provide: NACOS_NAMING_OPTIONS,
        useFactory: nacosNamingAsyncOptions.useFactory,
        inject: nacosNamingAsyncOptions.inject || [],
      };
    }

    // For useClass and useExisting...
    return {
      provide: NACOS_NAMING_OPTIONS,
      useFactory: async (optionsFactory: NacosNamingOptionsFactory) =>
        await optionsFactory.createNacosNamingOptions(),
      inject: [
        nacosNamingAsyncOptions.useExisting || nacosNamingAsyncOptions.useClass,
      ],
    };
  }
}
