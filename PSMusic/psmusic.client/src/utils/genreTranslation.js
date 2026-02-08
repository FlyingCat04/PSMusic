/**
 * Direct mapping from database genre names to translation keys
 * This ensures consistent translation keys regardless of special characters
 */
const GENRE_KEY_MAPPING = {
    // Vietnamese genres
    'Nhạc Trẻ': 'genre_nhac_tre',
    'Rap Việt': 'genre_rap_viet',
    'Nhạc Việt': 'genre_nhac_viet',
    'Âu Mỹ': 'genre_au_my',
    'Rock Việt': 'genre_rock_viet',

    // Special characters
    'R&B': 'genre_r_and_b',
    'Trap [EDM]': 'genre_trap_edm',

    // Hyphenated genres
    'Pop-Punk': 'genre_pop_punk',
    'Alt-Pop': 'genre_alt_pop',
    'Pop-rock': 'genre_pop_rock_hyphen', // lowercase variant
    'K-Pop': 'genre_k_pop',

    // Standard genres (English)
    'Pop': 'genre_pop',
    'Acoustic Rock': 'genre_acoustic_rock',
    'Pop Rock': 'genre_pop_rock',
    'Electroclash': 'genre_electroclash',
    'Dream Pop': 'genre_dream_pop',
    'Ambient Pop': 'genre_ambient_pop',
    'Folk Pop': 'genre_folk_pop',
    'Pop Anthem': 'genre_pop_anthem',
    'Dance': 'genre_dance',
    'Electropop': 'genre_electropop',
    'Rock': 'genre_rock',
    'Hip Hop': 'genre_hip_hop',
    'Rap': 'genre_rap',
    'Electronica': 'genre_electronica',
    'Future Bass': 'genre_future_bass',
    'EDM': 'genre_edm',
    'Synthpop': 'genre_synthpop',
    'Melancholic Pop': 'genre_melancholic_pop',
    'Speed Garage': 'genre_speed_garage',
    'Soul': 'genre_soul',
    'Ballad': 'genre_ballad',
    'Cypher': 'genre_cypher',
    'Rap Horrorcore': 'genre_rap_horrorcore',
    'Slowcore': 'genre_slowcore',
    'Ethereal Pop': 'genre_ethereal_pop',
    'Alternative Dance': 'genre_alternative_dance',
};

/**
 * Get translation key for a genre name
 * @param {string} genreName - The genre name from database
 * @returns {string} - The translation key (genre_xxx)
 */
export const getGenreTranslationKey = (genreName) => {
    if (!genreName) return 'genre_pop'; // Default fallback

    // Try direct mapping first
    if (GENRE_KEY_MAPPING[genreName]) {
        return GENRE_KEY_MAPPING[genreName];
    }

    // Fallback: auto-generate key for unmapped genres
    const key = genreName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/&/g, 'and_')
        .replace(/[^\w_]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');

    return `genre_${key}`;
};

/**
 * Get translated genre name using i18next
 * @param {string} genreName - The genre name from database
 * @param {Function} t - The i18next translation function
 * @returns {string} - The translated genre name or original if translation not found
 */
export const getTranslatedGenre = (genreName, t) => {
    if (!genreName || !t) return genreName || '';

    const translationKey = getGenreTranslationKey(genreName);
    const translated = t(translationKey);

    // If translation not found, i18next returns the key itself
    // In that case, return the original genre name
    return translated === translationKey ? genreName : translated;
};
