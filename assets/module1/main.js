import $ from 'jquery';
import 'core-js/es6/promise';
import css from './styles.scss';
import myClass from './dependencyOne';

const my = 4;
var res = my + 1;
const firstElement = $('.main li:first-child');
firstElement.addClass('pink');

console.log(process.env.HOST_UID);
const foo = new myClass(1, 2);
Promise.resolve('bar').then((bar) => console.log(foo.x, bar));
console.log(foo.y);
console.log(css);
console.log('3333');

