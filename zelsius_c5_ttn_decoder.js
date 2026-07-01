function fcvalue(bytes, length){
  switch (length){
    case 2:
      return bytes[1] << 8 | bytes[0];
    case 3:
      return bytes[2] << 16 | bytes[1] << 8 | bytes[0];
    case 4:
      return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
  }
}

function decodeUplink(input) {
  var data = {};
  var packet_type = input.bytes[0] >> 4;
  var packet_subtype = input.bytes[0] & 0x0F;
  var packet = packet_type + "." + packet_subtype;

  data.packettype = packet;
    
    switch (true){
      case packet=='0.1':
        data.energy = {
          value: fcvalue(input.bytes.slice(1, 5), 4) / 1000,
          unit: 'MWh'
        };
        data.cooling = {
          value: fcvalue(input.bytes.slice(5, 9), 4) / 1000,
          unit: 'MWh'
        };
        data.volume = {
          value: fcvalue(input.bytes.slice(9, 13), 4) / 1000,
          unit: 'm3'
        };
        break;

      case packet=='5.1':
        data.energy = {
          value: fcvalue(input.bytes.slice(1, 5), 4) / 1000,
          unit: 'MWh'
        };
        break;

      case packet=='9.1':
      case packet=='9.2':
      case packet=='9.3':
        data.data = {
          bytes: input.bytes
        };
        break;

    }

    return {
      data: data,
      warnings: [],
      errors:[]
    };
}
