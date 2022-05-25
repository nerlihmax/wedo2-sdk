export type SLRequest =
  | SLRequestDiscover
  | SLRequestConnect
  | SLRequestWrite
  | SLRequestStartNotifications;

export type SLRequestDiscover = {
  id: number;
  jsonrpc: '2.0';
  method: 'discover';
  params: {
    filters: [{ services: string[] }];
    optionalServices: string[];
  };
};

export type SLRequestConnect = {
  id: number;
  jsonrpc: '2.0';
  method: 'connect';
  params: {
    peripheralId: string;
  };
};

export type SLRequestWrite = {
  id: number;
  jsonrpc: '2.0';
  method: 'write';
  params: {
    serviceId: string;
    characteristicId: string;
    encoding: 'base64';
    message: string;
  };
};

export type SLRequestStartNotifications = {
  id: number;
  jsonrpc: '2.0';
  method: 'startNotifications';
  params: {
    serviceId: string;
    characteristicId: string;
    encoding: 'base64';
  };
};

export type SLResponse =
  | SLResponseDidDiscoverPeripheral
  | SLResponseCharacteristicDidChange;

export type SLResponseEmpty = {
  id: number;
  jsonrpc: '2.0';
  result: null;
};

export type SLResponseDidDiscoverPeripheral = {
  id: number;
  jsonrpc: '2.0';
  method: 'didDiscoverPeripheral';
  params: {
    name: string;
    peripheralId: string;
    rssi: -63;
  };
};

export type SLResponseCharacteristicDidChange = {
  jsonrpc: '2.0';
  method: 'characteristicDidChange';
  params: {
    serviceId: string;
    characteristicId: string;
    message: string;
    encoding: 'base64';
  };
};
