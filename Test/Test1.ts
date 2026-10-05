import { utils } from '../src/Utils';

async function unit_test() {
  // test case 1 of unit test
  if (utils.add(2, 2) === 4) {
  } else {
    console.log('Test Failed: utils.add(2, 2) === 4');
    process.exit(1);
  }
  if (utils.add(3, 3) === 6) {
  } else {
    console.log('Test Failed: utils.add(3, 3) === 6');
    process.exit(1);
  }
  if (utils.add_user('test', 'testnoassigning', 'password') === false) {
  } else {
    console.log('UnitTest Case 3: utils.add_user("test", "testnoassigning", "password") == false');
    process.exit(1);
  }
  console.log('All unit tests passed');
}

unit_test();
