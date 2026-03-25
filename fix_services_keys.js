const fs = require('fs');

const path = 'src/data/services.ts';
let content = fs.readFileSync(path, 'utf8');

const mapping = {
    "'security-camera-installation':": "'instalimi-kamerave-sigurise':",
    "'dahua-cctv-systems':": "'sistemet-dahua-cctv':",
    "'alarm-systems':": "'sistemet-alarmit':",
    "'electrical-installations':": "'instalime-elektrike':",
    "'electrical-repairs':": "'riparime-elektrike':",
    "'electrical-rewiring':": "'nderrim-instalimi-elektrik':",
    "'lighting-installation':": "'instalim-ndricimi':",
    "'electrical-panels':": "'panele-elektrike':",
    "'electrical-maintenance-business':": "'mirembajtje-elektrike-biznes':",
    "'emergency-electrician-24h':": "'elektricist-urgjent':",
    "'smart-home-automation':": "'smart-home-automatizimi':",
    "'ip-cameras':": "'kamerap-ip':",
    "'nvr-dvr-systems':": "'sistemet-nvr-dvr':",
    "'cctv-maintenance':": "'mirembajtja-cctv':",
    "'smart-home-security':": "'siguria-shtepise-menqur':",
    "'access-control':": "'kontrolli-hyrjes':",
    "'intercom-systems':": "'sistemet-interfonit':",
    "'video-intercom-systems':": "'interfoni-video':",
    "'network-internet-installation':": "'instalimi-rrjetit-internetit':",
    "'fiber-optic-installation':": "'instalimi-fibres-optike':",
    "'alarm-systems-anti-theft':": "'sistemet-e-alarmit':"
};

const parts = content.split('  en: {');
let enPart = parts[1];

for (const [oldK, newK] of Object.entries(mapping)) {
    enPart = enPart.replace(oldK, newK);
}

const finalContent = parts[0] + '  en: {' + enPart;
fs.writeFileSync(path, finalContent, 'utf8');
