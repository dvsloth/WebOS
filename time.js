const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const NTP_SERVER = 'time.windows.com';
const NTP_PORT = 123;
const message = Buffer.alloc(48);

message[0] = 0b00100011;

function toNtpTime(date) {
    const ntpEpoch = new Date('Jan 01 1900 UTC');
    const sinceNtpEpoch = date - ntpEpoch + 2208988800000;
    return {
        seconds: Math.floor(sinceNtpEpoch / 1000),
        fraction: Math.floor(((sinceNtpEpoch % 1000) / 1000) * 0x100000000)
    };
}

client.send(message, 0, message.length, NTP_PORT, NTP_SERVER, (err) => {
    if (err) {
        console.error('Failed to send message:', err);
        client.close();
    }
});

client.on('message', (msg) => {
    const seconds = msg.readUInt32BE(40);
    const ntpTime = new Date((seconds - 2208988800) * 1000);

    console.log('Received time from NTP server:', ntpTime.toUTCString());
    client.close();
});

client.on('error', (err) => {
    console.log(`Server error:\n${err.stack}`);
    client.close();
});
