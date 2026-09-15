<?php
/**
 * KadamVivah - Disposable / Temporary Email Blocker Helper
 * 
 * Protects registration against throwaway, disposable, and temporary inbox services.
 * Uses local maintainable blocklist without external paid API dependencies.
 */

class DisposableEmailBlocker {
    /**
     * Explicit safe-list of major legitimate email providers to prevent over-blocking.
     */
    private static array $trustedDomains = [
        'gmail.com' => true,
        'googlemail.com' => true,
        'yahoo.com' => true,
        'yahoo.co.in' => true,
        'yahoo.co.uk' => true,
        'yahoo.ca' => true,
        'yahoo.com.au' => true,
        'outlook.com' => true,
        'hotmail.com' => true,
        'live.com' => true,
        'msn.com' => true,
        'icloud.com' => true,
        'me.com' => true,
        'mac.com' => true,
        'proton.me' => true,
        'protonmail.com' => true,
        'zoho.com' => true,
        'zoho.in' => true,
        'rediffmail.com' => true,
        'aol.com' => true,
        'gmx.com' => true,
        'gmx.net' => true,
        'mail.com' => true,
        'yandex.com' => true,
        'fastmail.com' => true
    ];

    /**
     * Comprehensive maintainable blocklist of disposable / temporary email provider domains.
     */
    private static array $blockedDomains = [
        // Mailinator & aliases
        'mailinator.com' => true,
        'mailinator2.com' => true,
        'mailinator.net' => true,
        'mailinater.com' => true,
        'suremail.info' => true,
        'spamherelots.com' => true,
        'thisisnotmyrealemail.com' => true,
        'safetymail.info' => true,

        // Guerrilla Mail
        'guerrillamail.com' => true,
        'guerrillamail.net' => true,
        'guerrillamail.org' => true,
        'guerrillamail.biz' => true,
        'guerrillamail.de' => true,
        'guerrillamailblock.com' => true,
        'sharklasers.com' => true,
        'grr.la' => true,
        'pokemail.net' => true,
        'spam4.me' => true,

        // Temp-Mail & aliases
        'temp-mail.org' => true,
        'tempmail.com' => true,
        'temp-mail.io' => true,
        'tempail.com' => true,
        'tempmailo.com' => true,
        'tempmailaddress.com' => true,
        'tempmailgen.com' => true,

        // 10 Minute Mail
        '10minutemail.com' => true,
        '10minutemail.net' => true,
        '10minutemail.org' => true,
        '10minemail.com' => true,
        '10minute-mail.com' => true,
        'minutemailbox.com' => true,

        // YOPmail & aliases
        'yopmail.com' => true,
        'yopmail.fr' => true,
        'yopmail.net' => true,
        'cool.fr.nf' => true,
        'jetable.fr.nf' => true,
        'courriel.fr.nf' => true,
        'moncourrier.fr.nf' => true,
        'monemail.fr.nf' => true,
        'monmail.fr.nf' => true,
        'hide.biz.st' => true,
        'mytrashmail.com' => true,

        // Throwaway & Disposable Providers
        'dispostable.com' => true,
        'trashmail.com' => true,
        'trashmail.net' => true,
        'trashmail.org' => true,
        'trashmail.me' => true,
        'getairmail.com' => true,
        'maildrop.cc' => true,
        'fakeinbox.com' => true,
        'throwawaymail.com' => true,
        'mytemp.email' => true,
        'inboxkitten.com' => true,
        'crazymailing.com' => true,
        'nada.ltd' => true,
        'dropmail.me' => true,
        'emailondeck.com' => true,
        'mohmal.com' => true,
        'burnermail.io' => true,
        'discard.email' => true,
        'discardmail.com' => true,
        'tempr.email' => true,
        'generator.email' => true,
        'emailfake.com' => true,
        'fakemailgenerator.com' => true,
        'zillamail.com' => true,
        'getnada.com' => true,
        'harakirimail.com' => true,
        'inboxbear.com' => true,
        'trashinbox.com' => true,
        'meltmail.com' => true,
        'armyspy.com' => true,
        'cuvox.de' => true,
        'dayrep.com' => true,
        'fleckens.hu' => true,
        'gustr.com' => true,
        'jourrapide.com' => true,
        'rhyta.com' => true,
        'superrito.com' => true,
        'teleworm.us' => true,
        'einrot.com' => true
    ];

    /**
     * Extract normalized domain from email string.
     */
    public static function getDomain(string $email): ?string {
        $parts = explode('@', strtolower(trim($email)));
        if (count($parts) !== 2 || empty($parts[1])) {
            return null;
        }
        return trim($parts[1]);
    }

    /**
     * Check whether an email belongs to a disposable/temp provider.
     */
    public static function isDisposable(string $email): bool {
        $domain = self::getDomain($email);
        if (!$domain) {
            return false;
        }

        // 1. Check if it is on the trusted providers safe-list
        if (isset(self::$trustedDomains[$domain])) {
            return false;
        }

        // 2. Direct match in blocked domains
        if (isset(self::$blockedDomains[$domain])) {
            return true;
        }

        // 3. Subdomain match (e.g. sub.mailinator.com)
        $domainParts = explode('.', $domain);
        while (count($domainParts) > 1) {
            $parentDomain = implode('.', $domainParts);
            if (isset(self::$blockedDomains[$parentDomain])) {
                return true;
            }
            array_shift($domainParts);
        }

        return false;
    }
}
