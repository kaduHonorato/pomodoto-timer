// Constants created from HTML TAGS;

const tag_title = document.querySelector("title");
const tag_bt_open_configurations_menu = document.querySelector("#bt_open_configurations_menu");
const tag_bt_open_box_credits = document.querySelector("#bt_open_box_credits");

const tag_box_pomodoro_basic_info = document.querySelector("#box_pomodoro_basic_info");
const tag_txt_pomodoro_current_stage = document.querySelector("#txt_pomodoro_current_stage");
const tag_txt_pomodoro_current_time = document.querySelector("#txt_pomodoro_current_time");
const tag_txt_pomodoro_current_stage_duration = document.querySelector("#txt_pomodoro_current_stage_duration");

const tags_box_pomodoro_bars = document.querySelectorAll(".box_pomodoro_bar");
const tags_box_short_break_bars = document.querySelectorAll(".box_short_break_bar");
const tag_box_long_break_bar = document.querySelector(".box_long_break_bar");

const tags_progress_bars = document.querySelectorAll("progress");                                                       

const tag_pomodoro_bar_1 = document.querySelector("#pomodoro_bar_1");
const tag_pomodoro_bar_2 = document.querySelector("#pomodoro_bar_2");
const tag_pomodoro_bar_3 = document.querySelector("#pomodoro_bar_3");
const tag_pomodoro_bar_4 = document.querySelector("#pomodoro_bar_4");

const tag_short_break_bar_1 = document.querySelector("#short_break_bar_1");
const tag_short_break_bar_2 = document.querySelector("#short_break_bar_2");
const tag_short_break_bar_3 = document.querySelector("#short_break_bar_3");

const tag_long_break_bar_1 = document.querySelector("#long_break_bar_1");

const tag_bt_back = document.querySelector("#bt_back");
const tag_bt_start_resume = document.querySelector("#bt_start_resume");
const tag_bt_pause = document.querySelector("#bt_pause");
const tag_bt_cancel = document.querySelector("#bt_cancel");
const tag_bt_advance = document.querySelector("#bt_advance");

const tag_configurations_menu = document.querySelector("#configurations_menu");
const tag_bt_close_configurations_menu = document.querySelector("#bt_close_configurations_menu");

const tags_pomodoro_duration_raw_time = document.querySelectorAll("input[type = 'radio'][name = 'pomodoro_duration_raw_time']");
const tags_pomodoro_short_break_duration_raw_time = document.querySelectorAll("input[type = 'radio'][name = 'pomodoro_short_break_duration_raw_time']");
const tags_pomodoro_long_break_duration_raw_time = document.querySelectorAll("input[type = 'radio'][name = 'pomodoro_long_break_duration_raw_time']");

const tag_tic_tac_tune = document.querySelector("#tic_tac_tune");
const tag_audio_tic_tac_tune = document.querySelector("#audio_tic_tac_tune");

const tags_alarm_tune = document.querySelectorAll("input[type = 'radio'][name = 'alarm_tune']");
const tag_audio_alarm_tune = document.querySelector("#audio_alarm_tune");

const tag_bt_save_data = document.querySelector("#bt_save_data");

const tag_box_credits = document.querySelector("#box_credits");
const tag_bt_close_box_credits = document.querySelector("#bt_close_box_credits");

// Events

tag_bt_open_configurations_menu.addEventListener("click",Engine_open_configurations_menu); 
tag_bt_close_configurations_menu.addEventListener("click",Engine_close_configurations_menu); 

tag_bt_open_box_credits.addEventListener("click",Open_box_credits); 
tag_bt_close_box_credits.addEventListener("click",Close_box_credits); 

tag_bt_save_data.addEventListener("click",Engine_save_configurations_menu_data);

tag_bt_start_resume.addEventListener("click",Engine_start_resume_pomodoro);
tag_bt_pause.addEventListener("click",Engine_pause_pomodoro);
tag_bt_cancel.addEventListener("click",Engine_cancel_pomodoro);

tag_bt_back.addEventListener("click",() => { Engine_change_pomodoro_current_stage(-1); });
tag_bt_advance.addEventListener("click",Engine_advance_next_stage);

Create_event_helper(tags_pomodoro_duration_raw_time,"change",(ev) => { Customize_selected_label(ev.target); });
Create_event_helper(tags_pomodoro_short_break_duration_raw_time,"change",(ev) => { Customize_selected_label(ev.target); });
Create_event_helper(tags_pomodoro_long_break_duration_raw_time,"change",(ev) => { Customize_selected_label(ev.target); });    

Create_event_helper(tags_alarm_tune,"change",(ev) => { 
                                                        Customize_selected_label(ev.target);
                                                        Change_alarm_tune_src(Get_element_value(ev.target));
                                                       
                                                    
                                                       });  

                                                      

// ===========================================================================================================================================

// Auxiliary Variables;

var pomodoro;
var local_storage_data_configurations_menu;

var tic_tac_tune = new Audio("media/tic tac.mp3");
var alarm_tune = new Audio();

var alarm_tune_names = ["default.mp3","double hit.mp3","school bell.mp3","japanese school bell.mp3","beep.mp3"];

// ===========================================================================================================================================

Start();

function Start()
{   
    Set_element_attribute(tic_tac_tune,"loop",true);                                                  
    Engine_create_pomodoro(Engine_load_data());
}

// =========================================================================================================================================

function Engine_load_data()
{
    local_storage_data_configurations_menu = new Local_storage_data(1,"data_configurations_menu");

    var data_configurations_menu = local_storage_data_configurations_menu.load();

    if(data_configurations_menu.length)
        return Pomodoro.prototype.fromJson(data_configurations_menu);
    else
        return Create_pomodoro(["00:25:00","00:05:00","00:30:00",false,"0"]);    
            
}

// ======================================================================================================================================

function Fill_configurations_menu()
{
    Check_Element_by_value(tags_pomodoro_duration_raw_time,pomodoro.duration_raw_time);
    Check_Element_by_value(tags_pomodoro_short_break_duration_raw_time,pomodoro.short_break_duration_raw_time);
    Check_Element_by_value(tags_pomodoro_long_break_duration_raw_time,pomodoro.long_break_duration_raw_time);
    Set_element_checked(tag_tic_tac_tune,pomodoro.tic_tac_tune);
    Check_Element_by_value(tags_alarm_tune,pomodoro.tune);
    Change_alarm_tune_src(pomodoro.tune);
}

// ======================================================================================================================================

function Engine_create_pomodoro(pmd = null)
{
   
    pomodoro = (pmd) ? pmd : Create_pomodoro(); 

    if(pomodoro)
    {              
        Set_element_attribute(alarm_tune,"src",`media/${alarm_tune_names[+pomodoro.tune]}`);

        Configure_pomodoro();
        Engine_customize_countdown_bars();
           
        return true;
    }
    else
    {
        Message.alert_box("An error has occurred. Please, reload the page.");
        return false;
    }

}

// ========================================================================================


function Create_pomodoro(data = Get_configurations_menu_data())
{
     var [pomodoro_duration_raw_time,pomodoro_short_break_duration_raw_time,pomodoro_long_break_duration_raw_time,pomodoro_tic_tac_tune,pomodoro_alarm_tune] = data; 
  
    var pomodoro = new Pomodoro(pomodoro_duration_raw_time,pomodoro_short_break_duration_raw_time,pomodoro_long_break_duration_raw_time,
    pomodoro_tic_tac_tune,pomodoro_alarm_tune);
   
    return (pomodoro) ? pomodoro : null;

}

// ========================================================================================

function Engine_save_configurations_menu_data()
{
    Engine_close_configurations_menu();
    
    if(Engine_create_pomodoro())
    {
        Save_pomodoro_data();
        Message.alert_box("Done!");
    }
}

// ========================================================================================

function Save_pomodoro_data()
{
    local_storage_data_configurations_menu.save(pomodoro.toJson());
}

// ========================================================================================

function Engine_customize_countdown_bars()
{

    var pomodoro_duration = pomodoro.Calculate_duration(pomodoro.duration_raw_time);
    var pomodoro_short_break_duration = pomodoro.Calculate_duration(pomodoro.short_break_duration_raw_time);
    var pomodoro_long_break_duration = pomodoro.Calculate_duration(pomodoro.long_break_duration_raw_time);
    
    var durations_sum = (pomodoro_duration * 4) + (pomodoro_short_break_duration * 3) + pomodoro_long_break_duration;
    
   tag_pomodoro_bar_1.style.width = ((pomodoro_duration /  durations_sum) * 100) + "%";
   tag_pomodoro_bar_2.style.width =  ((pomodoro_duration /  durations_sum) * 100) + "%";
   tag_pomodoro_bar_3.style.width =  ((pomodoro_duration /  durations_sum) * 100) + "%";
   tag_pomodoro_bar_4.style.width = ((pomodoro_duration /  durations_sum) * 100) + "%";

   tag_short_break_bar_1.style.width = ((pomodoro_short_break_duration  /  durations_sum) * 100) + "%";
   tag_short_break_bar_2.style.width = ((pomodoro_short_break_duration  /  durations_sum) * 100) + "%";
   tag_short_break_bar_3.style.width = ((pomodoro_short_break_duration  /  durations_sum) * 100) + "%";

   tag_long_break_bar_1.style.width = ((pomodoro_long_break_duration /  durations_sum) * 100) + "%";



}

// ================================================================================================================================


function Get_configurations_menu_data()
{

    return [ 
                Get_checked_elements_values(tags_pomodoro_duration_raw_time),
                Get_checked_elements_values(tags_pomodoro_short_break_duration_raw_time),
                Get_checked_elements_values(tags_pomodoro_long_break_duration_raw_time),
                Get_element_checked(tag_tic_tac_tune),
                Get_checked_elements_values(tags_alarm_tune)
           ];

}

// ================================================================================================================================


function Engine_start_resume_pomodoro()
{
 
    if(pomodoro.status == 0)
        pomodoro.engine_control_pomodoro_stages();
    else if(pomodoro.status == 3)
        pomodoro.resume_time_interval();

    pomodoro.status = 1;

    Configure_pomodoro();

}

// ========================================================================================

function Engine_pause_pomodoro()
{
    pomodoro.clear_countdown_time_interval();   

    pomodoro.status = 3;

    Configure_pomodoro();

}

// ========================================================================================

function Engine_cancel_pomodoro()
{
    pomodoro.clear_countdown_time_interval();   

    pomodoro.status = 0;
    
    Set_element_value(tags_progress_bars[pomodoro.current_stage_index],0);

    Configure_pomodoro();


}

// ========================================================================================



function Engine_advance_next_stage()
{
    
    if(pomodoro.status == 2)
    {
      
        pomodoro.clear_countdown_time_interval();   
        Control_audio(alarm_tune,"stop");
        Control_audio(new Audio("media/change stage II.wav"),"play");

        Check_alarm_tune_status();
       
   
       
    }
    else if(pomodoro.status == 0)
        Engine_change_pomodoro_current_stage(1);

}



// ========================================================================================

async function Engine_change_pomodoro_current_stage(val)
{

    Control_audio(new Audio("media/change stage.wav"),"play");

    if(val == 1)
        Set_element_value(tags_progress_bars[pomodoro.current_stage_index],100); 
    else
        Set_element_value(tags_progress_bars[pomodoro.current_stage_index + val],0); 
        

    await Change_pomodoro_current_stage(((pomodoro.current_stage_index == 7) && (val == 1)) ? -7 : val);

          
    pomodoro.engine_control_pomodoro_stages();
    
    Configure_pomodoro();
     

        
}

// ==========================================================================================

async function Change_pomodoro_current_stage(val)
{
   

    pomodoro.current_stage_index += val;

    if(pomodoro.current_stage_index == 7)
        await Success_message(); 

    if((!(pomodoro.current_stage_index)) && (val == -7))
        Call_function_helper(Set_element_value,tags_progress_bars,"0");
 
    return 1;    

}

// ========================================================================================

async function Success_message()
{
         
    window.setTimeout(()=>{
  

        Control_audio(new Audio("media/success.mp3"),"play");
   
    },350);

    if(tag_bt_advance.classList.contains("box_shadow_animation"))
    {
        Remove_class(tag_bt_advance,"box_shadow_animation");
        Set_element_disabled(tag_bt_advance,true);
    }

    await Message.alert_box("Congratulations, you have completed all pomodoros! Take a long break now!");  

    return 1;
}

// =========================================================================================

function Configure_pomodoro()
{

const pomodoro_configurations = 

[

() => {
                                            
Set_element_txt(tag_title,`${pomodoro.current_stage_name}: 00:00 / ${Cut_string(pomodoro.raw_time,3,5)} `);
Set_element_txt(tag_txt_pomodoro_current_stage,`Current Stage: ${pomodoro.current_stage_name}`);
Set_element_txt(tag_txt_pomodoro_current_time,"00:00");
Set_element_txt(tag_txt_pomodoro_current_stage_duration,` / ${Cut_string(pomodoro.raw_time,3,5)}`);
Set_element_txt(tag_bt_start_resume,"Start");
                                                 
Remove_class(tag_box_pomodoro_basic_info,"blink_animation");
Remove_class(tag_bt_advance,"box_shadow_animation");
Remove_class(tag_bt_start_resume.parentElement,"display_none");

Add_class(tag_bt_pause.parentElement,"display_none");

if(!(pomodoro.current_stage_index))
    Remove_class(tag_bt_open_configurations_menu,"opacity_thirty_percent");
else 
    if(!(tag_bt_open_configurations_menu.classList.contains("opacity_thirty_percent")))
        Add_class(tag_bt_open_configurations_menu,"opacity_thirty_percent");  
        
Set_element_disabled(tag_bt_start_resume,false);
Set_element_disabled(tag_bt_pause,true);
Set_element_disabled(tag_bt_cancel,true);
Set_element_disabled(tag_bt_back,(pomodoro.current_stage_index == 0));
Set_element_disabled(tag_bt_advance,false);

Control_audio(tic_tac_tune,"stop");
   
},

() => {

Set_element_txt(tag_title,`${pomodoro.current_stage_name}: ${pomodoro.format_passed_time(pomodoro.passed_time)} / ${Cut_string(pomodoro.raw_time,3,5)}`);
Set_element_txt(tag_txt_pomodoro_current_stage,`Current Stage: ${pomodoro.current_stage_name}`);

Set_element_txt(tag_txt_pomodoro_current_time,`${pomodoro.format_passed_time(pomodoro.passed_time)}`);
Set_element_txt(tag_txt_pomodoro_current_stage_duration,` / ${Cut_string(pomodoro.raw_time,3,5)}`);
                            
Remove_class(tag_box_pomodoro_basic_info,"blink_animation");
Remove_class(tag_bt_advance,"box_shadow_animation");
Remove_class(tag_bt_pause.parentElement,"display_none");

Add_class(tag_bt_start_resume.parentElement,"display_none");    

if(!(tag_bt_open_configurations_menu.classList.contains("opacity_thirty_percent")))
    Add_class(tag_bt_open_configurations_menu,"opacity_thirty_percent");     

Set_element_disabled(tag_bt_start_resume,true);
Set_element_disabled(tag_bt_pause,false);
Set_element_disabled(tag_bt_cancel,false);
Set_element_disabled(tag_bt_back,true);
Set_element_disabled(tag_bt_advance,true);

if([0,2,4,6].some(index => (((index == pomodoro.current_stage_index) && (pomodoro.tic_tac_tune)))))
   Control_audio(tic_tac_tune,"play");
 

pomodoro.set_countdown_time_interval(Engine_pomodoro_countdown);
                                            
},

() => {

Set_element_txt(tag_title,`${pomodoro.current_stage_name}: ${Cut_string(pomodoro.raw_time,3,5)} / ${Cut_string(pomodoro.raw_time,3,5)}`);
Set_element_txt(tag_txt_pomodoro_current_time,`${Cut_string(pomodoro.raw_time,3,5)}`);


Add_class(tag_box_pomodoro_basic_info,"blink_animation");
Add_class(tag_bt_advance,"box_shadow_animation");

Set_element_disabled(tag_bt_pause,true);
Set_element_disabled(tag_bt_cancel,true);
Set_element_disabled(tag_bt_advance,false);

Control_audio(tic_tac_tune,"stop");


Set_element_attribute(alarm_tune,"loop",true);
Control_audio(alarm_tune,"play");


Set_element_value(tags_progress_bars[pomodoro.current_stage_index],100);  

                                

pomodoro.set_countdown_time_interval(Engine_pomodoro_alarm_countdown); 

},

() => {         

Set_element_txt(tag_bt_start_resume,"Resume");

Remove_class(tag_bt_start_resume.parentElement,"display_none");
Add_class(tag_bt_pause.parentElement,"display_none");

Set_element_disabled(tag_bt_start_resume,false);
Set_element_disabled(tag_bt_pause,true);
                                                   
Control_audio(tic_tac_tune,"pause");
                                                                          
                                                
},            

];

 
       
pomodoro_configurations[pomodoro.status]();

Call_function_helper(Remove_class,tags_progress_bars,"opacity_animation");
Add_class(tags_progress_bars[pomodoro.current_stage_index],"opacity_animation");
  
}

// ===========================================================================================

function Engine_pomodoro_countdown()
{
    pomodoro.update_passed_time();

    if(pomodoro.passed_time < pomodoro.duration)
    {
      
       
        Set_element_value(tags_progress_bars[pomodoro.current_stage_index],(pomodoro.passed_time / pomodoro.duration) * 100);        
        Set_element_txt(tag_txt_pomodoro_current_time,`${pomodoro.format_passed_time(pomodoro.passed_time)}`);
        Set_element_txt(tag_title,`${pomodoro.current_stage_name}: ${pomodoro.format_passed_time(pomodoro.passed_time)} / ${Cut_string(pomodoro.raw_time,3,5)}`);
    }   
    else 
    {       
               
        pomodoro.clear_countdown_time_interval();   

        pomodoro.automatic_interruption_end_time = pomodoro.automatic_interruption_raw_time;
        pomodoro.update_automatic_interruption_remain_time();
       
        pomodoro.status = 2;
        
        Configure_pomodoro();
    }   

}       

// ==========================================================================================

function Engine_pomodoro_alarm_countdown()
{

    if(pomodoro.automatic_interruption_remain_time <= 0)
    {       
        pomodoro.clear_countdown_time_interval();   
              
        Remove_element_attribute(alarm_tune,"loop");
        alarm_tune.addEventListener("timeupdate",Check_alarm_tune_status); 
  
    }
    else
        pomodoro.update_automatic_interruption_remain_time();
    
}   

// ========================================================================================

function Engine_close_configurations_menu()
{
    Close_configurations_menu();

    Control_audio(tag_audio_tic_tac_tune,"stop");
    Control_audio(tag_audio_alarm_tune,"stop");
}

// ========================================================================================

function Close_configurations_menu()
{
    Add_class(tag_configurations_menu.parentElement,"visibility_hidden"); 
}

// ========================================================================================

function Open_box_credits()
{
    Remove_class(tag_box_credits.parentElement,"visibility_hidden"); 
}

// ========================================================================================

function Close_box_credits()
{
    Add_class(tag_box_credits.parentElement,"visibility_hidden"); 
}


// ========================================================================================

function Engine_open_configurations_menu()
{
    if(tag_bt_open_configurations_menu.className.includes("opacity_thirty_percent"))
        return;
    
    Fill_configurations_menu();
    Engine_customize_selected_labels();
   
    Remove_class(tag_configurations_menu.parentElement,"visibility_hidden"); 

}

// ========================================================================================

function Control_audio(audio,action)
{
    
    switch(action)
    {
        case "play":
            audio.play();
        break;

        case "pause":
            audio.pause();
        break;

        case "stop":
            audio.pause();
            audio.currentTime = 0;
        break;
    }
}

// ========================================================================================

function Engine_customize_selected_labels()
{
  
    Customize_selected_label(Get_checked_element(tags_pomodoro_duration_raw_time));
    Customize_selected_label(Get_checked_element(tags_pomodoro_short_break_duration_raw_time));
    Customize_selected_label(Get_checked_element(tags_pomodoro_long_break_duration_raw_time));
    Customize_selected_label(Get_checked_element(tags_alarm_tune));

}

// =========================================================================================

function Customize_selected_label(element)
{

    element.parentElement.parentElement.querySelectorAll("label").forEach((label) => {
            
        Remove_class(label,"selected_label");
    });
         
    Add_class(element.parentElement,"selected_label");
}

// =========================================================================================

function Change_alarm_tune_src(index)
{
    Set_element_attribute(tag_audio_alarm_tune,"src",`media/${alarm_tune_names[+index]}`); 
}

// ===========================================================================================

const Check_alarm_tune_status = async function()
{
    if(alarm_tune.paused)
    {
                   
        alarm_tune.removeEventListener("timeupdate",Check_alarm_tune_status);
                                         
        await Change_pomodoro_current_stage((pomodoro.current_stage_index == 7) ? -7 : 1);
                                                 
        pomodoro.engine_control_pomodoro_stages();
    
        pomodoro.status = (pomodoro.current_stage_index) ? 1 : pomodoro.current_stage_index; 
                                 
        Configure_pomodoro();                  
    }
} 

// ==========================================================================================


// Default Functions;

// ========================================================================================

function Add_class(element,cls)
{

    element.classList.add(cls);

}

// ========================================================================================

function Remove_class(element,cls)
{

    element.classList.remove(cls);
    
}

// ========================================================================================

function Set_element_value(element,val)
{
    element.value = val;
}
    
// =========================================================================================

function Get_element_value(element)
{
    return element.value;
}

// =========================================================================================

function Set_element_checked(element,checked)
{

    element.checked = checked;

}

// =========================================================================================

function Get_element_checked(element)
{

    return element.checked;

}

// ==============================================================================

function Get_checked_elements_values(elements)
{

    var checked_elements = [];

    elements.forEach(element => {

        if(Get_element_checked(element))
            checked_elements.push(Get_element_value(element));
                        
    });

    if(checked_elements.length)
    {
        return (checked_elements.length == 1) ? checked_elements[0] : checked_elements;
    }
    else
        return null;
}

// ==========================================================================================

function Set_element_txt(element,txt)
{
    element.textContent = txt;
}

// ========================================================================================

function Cut_string(str,start_index,tot_char)
{
    return str.substr(start_index,tot_char);
}
    
// ========================================================================================

function Set_element_disabled(element,status = false)
{
    element.disabled = status;
}
        
// ========================================================================================

function Call_function_helper(func,elements,param = null)
{
    for(const element of elements)
    {    
        if(param)
            func(element,param);
        else
            func(element);  
    } 
}

// ========================================================================================

function Create_event_helper(elements,event,func,param = null)
{
    for(const element of elements)
    {
                        
        if(param)
            element.addEventListener(event,() => { func(param);});
        else
            element.addEventListener(event,func);
          
     }
}

// ===========================================================================================

function Check_Element_by_value(radio_elements,value)
{
    
    radio_elements.forEach(radio_element => {


        Set_element_checked(radio_element,Get_element_value(radio_element) == value);
       

        
    });
  
}

// ========================================================================================

function Get_checked_element(elements)
{

    var checked_element = null;

    elements.forEach((element) => { 

        if(Get_element_checked(element))
        {
            checked_element = element; 
        }

    });

    return checked_element;
} 

// ===========================================================================================


function Set_element_attribute(element,attr,val)
{
    element.setAttribute(attr,val);
            
}
    
// ===========================================================================================

function Get_element_attribute(element,attr)
{
   return element.getAttribute(attr);
        
}
    
// ===========================================================================================

function Remove_element_attribute(element,attr)
{
    element.removeAttribute(attr);
}
    
// ===========================================================================================