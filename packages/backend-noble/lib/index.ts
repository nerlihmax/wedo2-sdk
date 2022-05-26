import noble from '@abandonware/noble';
import { getLogger } from 'loglevel';
const log = getLogger('wedo2-sdk');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const process = require('node:process');
log.setLevel(
  (process.env?.NODE_ENV ?? 'production') === 'production' ? 'silent' : 'debug'
);
import { profile } from '@wedo2-sdk/shared';
import { isWedo2, findCharacteristic } from '@/utlis';

import type { Peripheral } from '@abandonware/noble';
import type { Wedo2BleBackend } from '@wedo2-sdk/shared';

export class Wedo2Noble implements Wedo2BleBackend {
  public deviceName = '';
  private conn?: Peripheral;

  async connect() {
    log.debug('[noble]: запущен бекенд noble');

    await noble.startScanningAsync();

    const peripheral = await new Promise<Peripheral>((resolve) => {
      noble.on('discover', async (peripheral) => {
        const { advertisement } = peripheral;
        const { localName } = advertisement;

        if (isWedo2(profile.services.commonService.uuid)(advertisement)) {
          log.info(`найдено wedo2 устройство ${localName}`);
          await peripheral.connectAsync();
          await peripheral.discoverAllServicesAndCharacteristicsAsync();

          resolve(peripheral);
        }
      });
    });

    this.deviceName = peripheral.advertisement.localName;

    this.conn = peripheral;
  }

  async subscribe(char: string) {
    if (!this.conn) {
      log.error('[noble]: подключение к устройству пропало');
    } else {
      log.debug(`[noble]: подписался нотификации на ${char.slice(4, 8)}`);

      findCharacteristic(this.conn, char).notifyAsync(true);
    }
  }
  async write(char: string, payload: Buffer) {
    if (!this.conn) {
      log.error('[noble]: подключение к устройству пропало');
    } else {
      log.debug(`[noble]: пишу в характеристику ${char.slice(4, 8)}`, payload);

      findCharacteristic(this.conn, char).writeAsync(payload, false);
    }
  }
  addNotificationCallback(char: string, callback: (data: Buffer) => void) {
    if (!this.conn) {
      log.error('[noble]: подключение к устройству пропало');
    } else {
      log.debug(
        `[noble]: ставлю колбек на нотификацию на характеристику ${char.slice(
          4,
          8
        )}`
      );

      findCharacteristic(this.conn, char).on('data', callback);
    }
  }
  async disconnect() {
    throw new Error('Method not implemented.');
  }
  onDisconnect(callback: () => void) {
    throw new Error('Method not implemented.');
  }
}
