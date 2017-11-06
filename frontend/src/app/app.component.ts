import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ['.tab-content .tab-pane {position: relative;}']
})
export class AppComponent {
  ngOnInit(){
    $('#favlisttab').on('shown.bs.tab', function (e) {
      let target = $(this).attr('href');

      $(target).css('left','-'+$(window).width()+'px');
      let left = $(target).offset().left;
      $(target).css({left:left}).animate({"left":"0px"}, "10");
    });

    $('#detailtab').on('shown.bs.tab', function (e) {
      let target = $(this).attr('href');

      $(target).css('left',$(window).width()+'px');
      let left = $(target).offset().left;
      $(target).css({left:left}).animate({"left":"0px"}, "10");
    })
  }

}
