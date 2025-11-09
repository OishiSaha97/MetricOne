import { Component } from '@angular/core';

interface Objective {

  title: string;
  selfText: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-self-assessment',
  templateUrl: './self-assessment.component.html',
  styleUrls: ['./self-assessment.component.css']
})
export class SelfAssessmentComponent {
  // objectives: any = [
  //   {name:'If any, list your accomplishments that do not specifically pertain to work objectives but may pertain to your ongoing job responsibilities.',isOpen: false, isEditingObjective:false},
  //   {name:'If any, list areas where you faced challenges that relate to your work objectives or ongoing job responsiblities.',isOpen: false, isEditingObjective:false},
  //   {name:'List areas where you feel you need to improve or where you feel you require more support (i.e., training, guidance and mentoring.',isOpen: false, isEditingObjective:false},
  // ];

  objectives: Objective[] = [
    {
      title: 'If any, list your accomplishments that do not specifically pertain to work objectives but may pertain to your ongoing job responsibilities.',
      selfText: '',
      isOpen: false
    },
    {
      title: 'If any, list areas where you faced challenges that relate to your work objectives or ongoing job responsibilities.',
      selfText: '',
      isOpen: false
    },
    {
      title: 'List areas where you feel you need to improve or where you feel you require more support (i.e., training, guidance and mentoring).',
      selfText: '',
      isOpen: false
    }
  ];



  isOpen: boolean[] = [];
  mode:any;
  objectiveTypes: string[] = ['Production', 'Support', 'Innovation', 'People', 'Other'];
  rating: any[] = ['Role Model', 'Very Good', 'Good', 'Improvement Required', 'Unacceptable'];
  overAllRating: any;


  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }


  onBack() {

  }

  onNext() {
    // collect all the entered data
    const answers = this.objectives.map((obj, index) => ({
      index: index + 1,
      title: obj.title,
      answer: obj.selfText,
    }));


    // if you want to send to backend:
    // const formData = new FormData();
    // formData.append('userId', this.userId);
    // formData.append('answers', JSON.stringify(answers));
    // this.kpiService.saveSelfAssessment(formData).subscribe(...);
  }

  isNextDisabled(): boolean {
    return this.objectives.some((o: Objective) => !(o.selfText && o.selfText.trim()));
  }

  onOverallRating(type: any) {
    this.overAllRating = type;
  }


}
