const pool = require("../Db");
const {
  insertAppointment,
  insertMember,
  removeAppointment,
  updateAppointment,
  selectAppointment,
  calendarAct,
  webSocketChat
} = require("../queries");

const { checkEmailQuery } = require("../query");

class BoProject {
  constructor() {}
}