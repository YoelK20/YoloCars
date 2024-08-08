'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
        email: "yoel.kristiadi.20@gmail.com",
        password: "123456",
        role: "Seller",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: "dylan@address.com",
        password: "654321",
        role: "Buyer",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
   await queryInterface.bulkInsert("Users", data, {})

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {})
  }
};
