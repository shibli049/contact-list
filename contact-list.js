Tasks = new Mongo.Collection("tasks");
// var my_notification = null;


function notifyMe(msg) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    // Meteoris.Flash.set('denied', msg);
    return;
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var my_notification = new Notification(msg,
      {
        // body: '',
        tag: 'default'
      }
    );
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
         var my_notification = new Notification(msg,{tag: 'default'});
       }
      });
    }


  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({}, {sort: {checked: 1, createdAt: -1}});
    }
  });


  Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var text = event.target.text.value;

      // Insert a task into the collection
      Tasks.insert({
        text: text,
        createdAt: new Date() // current time
      });

      // Clear form
      event.target.text.value = "";
      notifyMe('Task:' + text);

    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Tasks.update(this._id, {
        $set: {checked: ! this.checked}
      });

      notifyMe('Done:'+ this.text);

    },
    "click .delete": function () {
      Tasks.remove(this._id);
      notifyMe('Deleted:' + this.text);
    }



  });


}
