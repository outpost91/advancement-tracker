import { Component, Listen, Prop, State } from '@stencil/core';

import { AuthService } from '../../services/auth';
import { DatabaseService } from '../../services/Database';

@Component({
  tag: 'tracker-planner',
  styleUrl: 'tracker-planner.scss'
})
export class TrackerPlanner {
  @Prop() auth: AuthService;
  @Prop() db?: DatabaseService;

  @State() bible: any = [];
  @State() bibleRequirementLabel: string;
  @State() bibleRequirements: any = [];
  @State() groupValue: string;
  @State() meritRequirementLabel: string;
  @State() meritRequirements: any = [];
  @State() merits: any = [];
  
  handleSubmit(event) {
    event.preventDefault();
    
    console.log(event.target.value);
    // console.log(this.value);
  }

  handleChange(event) {
    // this.value = event.target.value;

    if (event.target.validity.typeMismatch) {
      console.log('this element is not valid')
    }
  }

  //@Listen('ionChange')
  //onIonChange(event: CustomEvent) {
  //  console.log("Event emitted")
  //  console.log(event.detail);
  //  this.selectValue = event.target.value;
  //}

  @Listen('trackerSegmentChange')
  onTrackerSegmentChange(event: CustomEvent) {
    this.groupValue = event.detail.value;
    this.db.merits(event.detail.value).then(value => {
      this.merits = value;
    })
    if (this.groupValue !== 'Ranger Kids') {
      //this.db.bibles(event.detail.value).then(value => {
      //  this.merits = value;
      //})
    }
  }

  @Listen('trackerSelectChange')
  onTrackerSelectChange(event: CustomEvent) {
    if (event.detail.id === 'merit-id') {
      this.meritRequirementLabel = event.detail.text;
      this.db.requirements(event.detail.value).then(value => {
        // Clear out exsiting array
        this.meritRequirements = [];
        
        // build current array
        for (let index = 0; index < value; index++) {
          this.meritRequirements = [...this.meritRequirements, {id: index+1, value: "Requirement " + (index+1)}]; 
        }
      })
    }
    if (event.detail.id === 'bible-id') {
      this.bibleRequirementLabel = event.detail.text;
      this.db.requirements(event.detail.value).then(value => {
        // Clear out exsiting array
        this.bibleRequirements = [];
        
        // build current array
        for (let index = 0; index < value; index++) {
          this.bibleRequirements = [...this.bibleRequirements, {id: index+1, value: "Requirement " + (index+1)}]; 
        }
      })
    }
  }

/*  handleSecondSelect(event) {
  console.log(event.target.value);
    this.secondSelectValue = event.target.value;
  }

  buildCheckboxes = ( pre_str, id, value ) => {
    /*
      ** Template ** 
    <span class="form-radio-container">
      <input name="checkbox-requirement[]" id="checkbox-requirement-0" value="requirement" type="checkbox">
      <label for="checkbox-requirement-0">Requirement 1</label>
    </span>
    */
/*    let span = document.createElement('SPAN');
    span.setAttribute("class", "form-radio-container");
          
    let input = document.createElement('INPUT');
    input.setAttribute("name",  pre_str.concat("[]"));
    input.setAttribute("id",    pre_str.concat("-", id));
    input.setAttribute("value", value );
    input.setAttribute("type", "checkbox");
          
    let label = document.createElement('LABEL');
    label.setAttribute("for", pre_str.concat("-", id));
    label.textContent = value;
          
    //Nest all the elements
    span.append(input, label)
    
    return span;
  }
  
  buildFirebaseObject = (elt, attr_key) => {
    obj = {}
    let c = elt.firstElementChild.children;
      let reqData = {};
      for (let i = 0; i < c.length; i++) {
      obj[ c[i].getElementsByTagName("INPUT")[0][attr_key]] = c[i].getElementsByTagName("INPUT")[0].checked;
      }
    
    return obj;
  }
  
  removeChildren = (elt) => {
    while (elt.firstElementChild) {
      elt.removeChild(elt.firstElementChild);
    }
  }
  
  addLessonAttendance = () => {
    let data = {
        name:  lssn_mrt.value,
        date:  lssn_dt.value,
      instance_id: instance_id,
        reqs:  buildFirebaseObject(lssn_req, 'value'),
      attendance: buildFirebaseObject(lssn_att, 'id')
      };
  
    // Add lesson notes if supplied
    if (lssn_note.value != "") {
      data["notes"] = lssn_note.value;
    }
    
    firebaseLessonRef
        .push(data)
        .then(childsnapshot => {
          console.log("New Lesson Data added successfully!");
      removeChildren(lssn_req.firstElementChild)
      removeChildren(lssn_att.firstElementChild)
      
      // reset the from data
      lssn_frm[0].reset();
      
        })
        .catch(error => {
          console.error("Lesson Data add failed: " + error.message);
        });
  }
  
  updateAttendanceList = () => {
    let date = moment($('#input-date').val()).format('YYYY-MM-DD');
    let parent = lssn_att.firstElementChild;
    
    removeChildren(parent)
     
    const params = []
    params.push('calendar='.concat('Royal Rangers'))
    params.push('start_date='.concat(date))
    params.push('end_date='.concat(date))
    if ( $('#instance_id').attr('value') !== undefined
      && $('#instance_id').attr('value') !== '' ) {
      params.push('instance_id='.concat($('#instance_id').attr('value')))
    }
          
      fetch('https://ranger-tracker.firebaseapp.com/listEligible'.concat('?', params.join('&')), options)
      .then( res => res.json() )
      .then( data => {
        try {
          if( data.length > 1
           && data[0].oid !== undefined
           && data[0].event_id !== undefined ) {
            //display choice to user for selecting correct event
            let text = data
                  .filter( x => x.start_datetime.startsWith(date) )
                  .reduce((ary, x) => { 
                    ary.push([x.id, x.name].join(' - '))
                    return ary 
                  }, ['Multiple events found! Please select one by entering the id to the left of event:'])
                  .join('\n')
            
            //TODO: make better user form 
            let id = prompt(text);
  
            if (id == null || id == "") {
                console.log("User canceled the prompt.")
            } else {
                const params = []
              params.push('calendar='.concat('Royal Rangers'))
              params.push('start_date='.concat(date))
              params.push('end_date='.concat(date))
              params.push('instance_id='.concat(id))
    
                return fetch('https://ranger-tracker.firebaseapp.com/listEligible'.concat('?', params.join('&')), options)
            }
          } else {			  
            return data
          }
        }
        catch(e) {
          console.error(e)
          return data
        }
      })
      .then( res2 => {
        try {
          return res2.json()
        } catch(e) {
          return res2
        }
      })
      .then( data => {
        data.sort( (a, b) => {
          const x = a['last_name'].toLowerCase().concat(', ', a['force_first_name'].toLowerCase())
          const y = b['last_name'].toLowerCase().concat(', ', b['force_first_name'].toLowerCase())
          return (x < y) ? -1 : (x > y) ? 1 : 0
        })
        .map( person => parent.appendChild(buildCheckboxes('checkbox-attendance', person['id'], person['last_name'].concat(', ', person['force_first_name']))))
      })
      .catch( error => {
        console.error(error)
        instance_id = -1
      })
  }
  
  updateRequirementsList = index => {
    let merit_key = lssn_mrt.options[index].id;
    let parent = lssn_req.firstElementChild;
    
    removeChildren(parent)
    
    firebaseRootRef.child('merits/' + merit_key).once("value", snapshot => {
      if( snapshot.hasChild('num-reqs')
       && snapshot.child('num-reqs').val() ) {
        
        for(let i=1; i<=parseInt(snapshot.child('num-reqs').val()); i++ ) {
          parent.appendChild(buildCheckboxes('checkbox-requirement', i, 'Requirement'.concat(' ', i)));
        }
      }
    });
  }
  */

  render() {
    return (
      <ion-page>
        <ion-header>
         <ion-title>Royal Ranger Planner</ion-title> 
        </ion-header>
        <ion-content>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <ion-list lines="none">
              <tracker-planner-date-item id="date" />
              <tracker-planner-segment-item id="group-id" items={['one', 'two', 'three']} />
              <tracker-planner-select-item id="merit-id" items={this.merits} label="Merit Lesson" />
              <tracker-planner-checkbox-item id="merit-requirements" items={this.meritRequirements} label={(this.meritRequirementLabel !== '' && this.meritRequirementLabel !== undefined) ? this.meritRequirementLabel + " Requirements:" : "Requirements"} />
              {(this.groupValue !== 'Ranger Kids')
                ? <tracker-planner-select-item id="bible-id" items={this.bible} label="Bible Lesson" />
                : null
              }
              {(this.groupValue !== 'Ranger Kids')
                ? <tracker-planner-checkbox-item id="bible-requirements" items={this.bibleRequirements} label={(this.bibleRequirementLabel !== '' && this.bibleRequirementLabel !== undefined) ? this.bibleRequirementLabel + " Requirements:" : "Requirements"} />
                : null
              }
              <tracker-planner-checkbox-item id="attendance" items={0} label="Attendance" />
              <ion-item>
                <ion-button type="submit" slot="end">Submit</ion-button>
              </ion-item>
            </ion-list>
          </form>
        </ion-content>
      </ion-page>
    );
  }
}