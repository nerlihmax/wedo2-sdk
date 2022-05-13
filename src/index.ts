import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { match } from 'ts-pattern';

import { registerSensor } from './wedo2/cmds/input';
import {
  addNotificationListener,
  connect,
  setupNotifications,
} from './wedo2/connection';
import {
  Wedo2IoType,
  wedo2IoType,
  wedo2MeasurementUnit,
} from './wedo2/devices';
import { Wedo2Sensor, wedo2TiltSensorMode } from './wedo2/devices/sensor';
import {
  Wedo2EventAttachedIo,
  Wedo2EventAttachedIoAttach,
  wedo2EventAttachedIoType,
} from './wedo2/events/attachedIo';
import { Wedo2EventSensorValue } from './wedo2/events/sensorValue';
import { profile } from './wedo2/gatt';

const bootstrap = () =>
  connect()
    .then(setupNotifications)
    .then((conn) => {
      addNotificationListener(
        profile.services.commonService.characteristics.attachedIo,
        async (e) => {
          const event = e as unknown as Wedo2EventAttachedIo;
          console.log('received attachIo', event);

          const sensor = match<
            Wedo2EventAttachedIo,
            Either<Error, Wedo2Sensor>
          >(event)
            .with({ type: wedo2EventAttachedIoType.ATTACHED }, ({ ioType }) =>
              match<Wedo2IoType, Either<Error, Wedo2Sensor>>(ioType)
                .with(wedo2IoType.EXTERNAL_TILT, () =>
                  right({
                    _tag: 'tilt',
                    ioType: ioType,
                    measurement: wedo2MeasurementUnit.SI,
                    mode: wedo2TiltSensorMode.ANGLE,
                    port: event.port,
                  })
                )
                .otherwise(() => left(new Error('неизвестный тип датчика')))
            )
            .with({ type: wedo2EventAttachedIoType.ATTACHED_VIRTUAL }, () =>
              left(new Error(`подключено виртуальное устройство`))
            )
            .with({ type: wedo2EventAttachedIoType.DETACHED }, ({ port }) =>
              left(new Error(`от порта ${port} отключено устройство`))
            )
            .exhaustive();

          if (isLeft(sensor)) {
            console.log(sensor);
            return;
          }

          console.log('registerSensor', sensor);
          // registerSensor;
        }
      );
      return conn;
    });
// .then(
//   addNotificationListener(
//     profile.services.ioService.characteristics.sensorValue,
//     (e) => {
//       const event = e as unknown as Wedo2EventSensorValue;

//       console.log('received sensorValue', event);
//     }
//   )
// );

bootstrap();
