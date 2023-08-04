import { NgModule } from '@angular/core';
import { CustomMinDirective } from './custom-min-max/custom-min';
import { CustomMaxDirective } from './custom-min-max/custom-max';
import { OnInitDirective } from './on-init.directive';
import { CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { DragDropDirective } from './drag-drop.directive';
@NgModule({
	declarations: [CustomMaxDirective, CustomMinDirective, OnInitDirective],
	imports: [],
	exports: [CustomMaxDirective, CustomMinDirective, OnInitDirective]
})
export class DirectivesModule { }
