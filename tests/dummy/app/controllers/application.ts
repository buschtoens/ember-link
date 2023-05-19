import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  queryParams = ['applicationCategory', 'applicationColor'];

  @tracked applicationCategory = 'all';
  @tracked applicationColor = 'red';

	update =(name: string , e: InputEvent) => {
		//@ts-expect-error
		this[name] = (e.target as HTMLInputElement).value;
	}
}
