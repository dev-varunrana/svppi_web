import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-affiliation',
  templateUrl: './affiliation.component.html',
  styleUrls: ['./affiliation.component.scss']
})
export class AffiliationComponent implements OnInit {

  affiliations = [
    {
      src: "assets/images/affiliations/vivo.jpg",
      url: "https://vivohealthcare.com/skill-center.html"
    },
    {
      src: "assets/images/affiliations/spfl.jpg",
      url: "https://stateparamedicalfaculty.com"
    },
    {
      src: "assets/images/affiliations/nsdc.jpg",
      url: "https://nsdcindia.org/"
    },
    {
      src: "assets/images/affiliations/hssc.jpg",
      url: "https://www.healthcare-ssc.in/"
    },
    {
      src: "assets/images/affiliations/msde.jpg",
      url: "https://www.msde.gov.in/"
    },
    {
      src: "assets/images/affiliations/ssu.jpg",
      url: "https://www.sikkimskilluniversity.ac.in/"
    },
    {
      src: "assets/images/affiliations/niti.jpg",
      url: "https://ngodarpan.gov.in/"
    },
    {
      src: "assets/images/affiliations/dsgpmc.jpg",
      url: "https://paramedicalcouncildelhi.com/"
    },

  ]

  constructor() { }

  ngOnInit(): void {
  }

}
