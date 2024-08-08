'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   
    const data = [
      {
        fullName: "Yoel Kristiadi",
        gender: "Male",
        address: "Batam",
        phoneNumber: "08117011200",
        UserId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: "Dylan",
        gender: "Male",
        address: "Tangerang",
        phoneNumber: "087722959866",
        UserId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]
    await queryInterface.bulkInsert("Profiles", data, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Profiles", null, {})
  }
};
