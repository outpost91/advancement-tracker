import config from '../global/environment';

export class ConfigService {
  get(name: string) {
    return config[name];
  }
}
