class Time_interval
{
            
    constructor(id,tp,name,raw_time,tune,automatic_start,automatic_interruption_raw_time)
    {
        this.id = id;
        this.tp = tp;
        this.name = name;
        this.raw_time = raw_time;
     
        this.tune = tune;
        this.automatic_start = automatic_start;
        this.automatic_interruption_raw_time = +automatic_interruption_raw_time;
       
        this.status = (this.automatic_start) ? 1 : 0;
  

        /*
           STATUS
           
           0 - waiting
           1 - running 
           2 - ringing
           3 - paused
        
        */
                 
    }


    set id(id)
    {
        this._id = id;  
    }

    get id()
    {
        return this._id;  
    }

    set tp(tp)
    {
        this._tp = tp;
    }

    get tp()
    {
        return this._tp;
    }

    set name(name)
    {
        this._name = name;
    }

    get name()
    {
        return this._name;
    }

    set raw_time(raw_time)
    {
        this._raw_time = raw_time;
    }

    get raw_time()
    {
        return this._raw_time;
    }

    set current_time(dt)
    {
        this._current_time = dt;  
    }

    get current_time()
    {
        return this._current_time;  
    }

    set remain_time(t)
    {
        this._remain_time = t;   
    }

    get remain_time()
    {
        return this._remain_time;  
    }
  

    set tune(tune)
    {
        this._tune = tune;
    }

    get tune()
    {
        return this._tune;
    }

    set automatic_start(automatic_start)
    {
        this._automatic_start = automatic_start;
    }

    get automatic_start()
    {
        return this._automatic_start;
    }

    set automatic_interruption_raw_time(automatic_interruption_raw_time)
    {
        this._automatic_interruption_raw_time = automatic_interruption_raw_time;
    }

    get automatic_interruption_raw_time()
    {
        return this._automatic_interruption_raw_time;
    }

    set automatic_interruption_end_time(automatic_interruption_raw_time)
    {
        var time_interval = new Date(); 
      
        time_interval.setSeconds(time_interval.getSeconds() + automatic_interruption_raw_time);
        this._automatic_interruption_end_time = time_interval;

        
    }

    get automatic_interruption_end_time()
    {
        return this._automatic_interruption_end_time;
    }

    set automatic_interruption_remain_time(automatic_interruption_remain_time)
    {
        this._automatic_interruption_remain_time = automatic_interruption_remain_time;
    }

    get automatic_interruption_remain_time()
    {
        return this._automatic_interruption_remain_time;
    }

    set status(status)
    {
        this._status = status;
    }

    get status()
    {
        return this._status;
    }

    set countdown(func)
    {
        this._countdown = func; 
    }

    get countdown()
    {
        return this._countdown;
    }



    set end_time(end_time)
    {
        this._end_time = end_time;
    }

    get end_time()
    {
        return this._end_time;
    }
 
    set_time_interval_initial_configurations()
    {
        this.current_time = new Date();
        this.end_time = this.engine_set_end_time(this.raw_time);
        this.remain_time = (this.end_time - this.current_time);
         
    }

    format_remain_time(remain_time)
    {    
        var [hours,minutes,seconds] = this.format_milliseconds(remain_time);
                 
        return `${hours}:${minutes}:${seconds}`;  
    }


    update_remain_time()
    {
        this.current_time = new Date();

        this.remain_time = (this.end_time - this.current_time);
      
      
    }
    

    update_automatic_interruption_remain_time()
    {
        this.current_time = new Date();
 

        this.automatic_interruption_remain_time = (this.automatic_interruption_end_time - this.current_time);
    }

    set_countdown_time_interval(callback_function)
    {
        this.countdown = window.setInterval(callback_function,1000); 
    }

    clear_countdown_time_interval()
    {
        window.clearInterval(this.countdown);
        this.countdown = null;
    }


    format_milliseconds(milliseconds)
    {
         
          
  
        var hours = (milliseconds - (milliseconds % 3600000)) / 3600000;

        milliseconds -= hours * 3600000;

        var minutes = (milliseconds - (milliseconds % 60000)) / 60000;

        milliseconds -= minutes * 60000;

        var seconds = (milliseconds - (milliseconds % 1000)) / 1000;
          
       return this.add_zero([hours,minutes,seconds]);
    }
        
    add_zero(numbers)
    {
        for(var i = 0; i < numbers.length;i++)
        {
            if(numbers[i] < 10)
                numbers[i] = "0" + numbers[i];
        }    
        
        return numbers;
    }


}


class Alarm extends Time_interval
{
    constructor(id,tp,name,raw_time,tune,automatic_start,automatic_interruption_raw_time)
    {
        super(id,tp,name,raw_time,tune,automatic_start,automatic_interruption_raw_time);
    }


    engine_set_end_time(time)
    {
        this.current_time = new Date(); 
        var time_interval = new Date();
      
        var [hours,minutes,seconds] = time.split(":");

        time_interval.setHours(hours);
        time_interval.setMinutes(minutes);
        time_interval.setSeconds(seconds);
     
                
        if(this.current_time > time_interval)
            time_interval.setDate(time_interval.getDate() + 1);
        
     
        return time_interval;
       
    }
  
}



class Timer extends Time_interval
{
    constructor(id,tp,name,raw_time,tune,automatic_start,automatic_interruption_raw_time)
    {
        super(id,tp,name,raw_time,tune,automatic_start,automatic_interruption_raw_time);
    }

    engine_set_end_time(time)
    {
        var time_interval = new Date(); 

        var [hours,minutes,seconds] = time.split(":");
   
        time_interval.setHours(time_interval.getHours() + +hours);
        time_interval.setMinutes(time_interval.getMinutes() + +minutes);
        time_interval.setSeconds(time_interval.getSeconds() + +seconds);

        return time_interval;
    }

    
    resume_time_interval()
    {
        this.end_time = this.engine_set_end_time(this.format_milliseconds(this.remain_time).join(":"));
    }
    

}


class Pomodoro extends Timer
{

    constructor(duration_raw_time,short_break_duration_raw_time,long_break_duration_raw_time,tic_tac_tune,alarm_tune,current_stage_index = 0)
    {   
       
        super("1","2","Pomodoro","00:00:00",alarm_tune,false,"5");
               
        this.duration_raw_time = duration_raw_time;
        this.short_break_duration_raw_time = short_break_duration_raw_time;
        this.long_break_duration_raw_time = long_break_duration_raw_time;
        this.tic_tac_tune = tic_tac_tune;
        this.current_stage_index = current_stage_index;
        this.current_stage_name = current_stage_index;

        this.engine_control_pomodoro_stages();
    }

    set duration(raw_time) 
    {
        this._duration = this.Calculate_duration(raw_time); 
    }

    get duration()
    {
        return this._duration; 
    }

    set duration_raw_time(duration_raw_time) 
    {
        this._duration_raw_time = duration_raw_time; 
    }

    get duration_raw_time()
    {
        return this._duration_raw_time; 
    }


    set short_break_duration_raw_time(short_break_duration_raw_time) 
    {
        this._short_break_duration_raw_time = short_break_duration_raw_time; 
    }

    get short_break_duration_raw_time()
    {
        return this._short_break_duration_raw_time; 
    }

    set long_break_duration_raw_time(long_break_duration_raw_time) 
    {
        this._long_break_duration_raw_time = long_break_duration_raw_time; 
    }

    get long_break_duration_raw_time()
    {
        return this._long_break_duration_raw_time; 
    }

    set tic_tac_tune(tic_tac_tune) 
    {
        this._tic_tac_tune = tic_tac_tune; 
    }

    get tic_tac_tune()
    {
        return this._tic_tac_tune; 
    }

    set current_stage_index(index)
    {
        this._current_stage_index = index;  
    }


    get current_stage_index()
    {
        return this._current_stage_index;  
    }

    
    set current_stage_name(index)
    {

        var current_stage_names = [
            "Pomodoro I",
            "Short Break I",
            "Pomodoro II",
            "Short Break II",
            "Pomodoro III",
            "Short Break III",
            "Pomodoro IV",
            "Long Break"
          ];


        this._current_stage_name =  current_stage_names[index];   
    }

    get current_stage_name()
    {
        return this._current_stage_name;  
    }

    set countdown_start_time(time)
    {
        this._countdown_start_time = time;
    }

    get countdown_start_time()
    {
        return this._countdown_start_time;
    }

    set passed_time(time)
    {
        this._passed_time = time;
    }

    get passed_time()
    {
        return this._passed_time;
    }

     
    set_time_interval_initial_configurations()
    {    
        this.duration = this.raw_time;   
        this.countdown_start_time = this.current_time;

        this.update_passed_time();
    }


    update_passed_time()
    {
      
        this.current_time = new Date();
        this.passed_time = this.current_time - this.countdown_start_time;
      
    }

    format_passed_time(passed_time)
    {    
        var [,minutes,seconds] = this.format_milliseconds(passed_time);
                 
        return `${minutes}:${seconds}`;  
    }
   
        
    resume_time_interval()
    {
     
        this.countdown_start_time = new Date();

        this.countdown_start_time.setMilliseconds(this.countdown_start_time.getMilliseconds() - this.passed_time);
    }

    Calculate_duration(raw_time)
    {

        this.current_time = new Date();
        this.end_time = this.engine_set_end_time(raw_time);

        return (this.end_time - this.current_time); 

    }


    engine_control_pomodoro_stages()
    {

        this.current_stage_name = this.current_stage_index;
                    
       
        switch(this.current_stage_index)
       {
            case 0:
            case 2:
            case 4:
            case 6:    
                this.raw_time = this.duration_raw_time;
            break; 

            case 1:
            case 3:
            case 5: 
                this.raw_time = this.short_break_duration_raw_time; 
            break;

            case 7:
                this.raw_time = this.long_break_duration_raw_time; 
            break;
       }
           
       
      
       this.set_time_interval_initial_configurations();

    }

} 



Time_interval.prototype.toJson = function()
{
                    
    return JSON.stringify({
                           id:this.id,
                           tp:this.tp,
                           name:this.name,
                           raw_time:this.raw_time,
                           tune:this.tune, 
                           automatic_start:this.automatic_start,
                           automatic_interruption_raw_time:this.automatic_interruption_raw_time     
                          });
};


Time_interval.prototype.fromJson = function(json)
{
              var data = JSON.parse(json);

              var time_interval_classes = [Alarm,Timer];
              
              return new time_interval_classes[+data.tp](data.id,data.tp,data.name,data.raw_time,data.tune,data.automatic_start,data.automatic_interruption_raw_time);
                                                        
};  



Pomodoro.prototype.fromJson = function(json)
{
              var data = JSON.parse(json);

              return new Pomodoro(data.duration_raw_time,data.short_break_duration_raw_time,data.long_break_duration_raw_time,data.tic_tac_tune,data.tune,data.current_stage_index);
                                                                   
};  


Pomodoro.prototype.toJson = function()
{
                    
    return JSON.stringify({
                            duration_raw_time:this.duration_raw_time,
                            short_break_duration_raw_time:this.short_break_duration_raw_time,
                            long_break_duration_raw_time:this.long_break_duration_raw_time,
                            tic_tac_tune:this.tic_tac_tune,
                            tune:this.tune,
                            current_stage_index:this.current_stage_index  
                          });
};



