import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  queryParams = [
    {
      category: 'parentCategory'
    },
    'parentColor'
  ];

  @tracked category = 'all';
  @tracked parentColor = 'red';
}
