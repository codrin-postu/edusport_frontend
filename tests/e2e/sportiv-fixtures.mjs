// Synthetic sportiv accounts and athletes for the sportiv BFF e2e. No real names or addresses.
export const SPORTIV_PASSWORD = "Throwaway-Sportiv-1";
export const ANA_ID = "athana0001";
export const MIHAI_ID = "athmihai01";
export const ADULT_ID = "athadult01";
export const FOREIGN_ID = "athforeign1";

export const SPORTIV_ACCOUNTS = {
  "parinte1@example.invalid": { name: "Elena Marinescu", phone: "0722 000 222", password: SPORTIV_PASSWORD, google: false, athletes: [ANA_ID, MIHAI_ID] },
  "sportiv18@example.invalid": { name: "Sorin Albu", phone: null, password: SPORTIV_PASSWORD, google: false, athletes: [ADULT_ID] },
};

export const SPORTIV_ATHLETES = {
  [ANA_ID]: { firstName: "Ana" },
  [MIHAI_ID]: { firstName: "Mihai" },
  [ADULT_ID]: { firstName: "Sorin" },
};

export const ICS_BODY = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//EduSport//RO\r\nEND:VCALENDAR\r\n";
