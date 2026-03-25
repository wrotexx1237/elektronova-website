import re

def main():
    with open('src/data/services.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    mapping = {
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
    }

    # Only replace in the 'en: {' section
    sq_part, en_part = content.split('  en: {', 1)
    
    for old_k, new_k in mapping.items():
        en_part = en_part.replace(old_k, new_k)
        
    final_content = sq_part + '  en: {' + en_part
    
    with open('src/data/services.ts', 'w', encoding='utf-8') as f:
        f.write(final_content)

if __name__ == '__main__':
    main()
