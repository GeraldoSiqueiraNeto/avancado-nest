import { Injectable } from '@nestjs/common'
import { EnvConfig } from './env-config'
@Injectable()
export class EnvConfigService extends EnvConfig {}
