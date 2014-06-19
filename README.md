# Hull Instant Win Game

Hull InstantWin games allow you to create simple games to give away Prizes to your Users.

When a User participates, the game provides immediate feedback telling him if he won a Prize or not.

If the participation does not unlock a Prize, the User is invited to re-try later. By default, Users are allowed to make one attempt per day.

If a Prize is unlocked, the User has won and can't play again.

## The InstantWin object

InstantWins are a specific type of [Hull Achievements](http://hull.io/docs/references/api#endpoint-achievements) that can be configured with a list of Prizes that can be "unlocked" by a User.

InstantWins belong to a Hull App and have the following attributes : 

* ***name*** (String, required) a Name for the InstantWin object
* ***description*** (String, optional) a textual description for the InstantWin
* ***picture*** (String, optional)  valid URL of an image describing the InstantWin.
* ***extra*** (Object, optional) free form object containing additional information about the InstantWin.

## Prizes and Prize attribution mechanic

Each Prize, has the following attributes : 

* ***available_at*** (Date, required) a Date when the Prize can be unlocked.
* ***name*** (String, required) a Name for the Prize.
* ***description*** (String, optional) a textual description for the Prize.
* ***picture*** (String, optional) valid URL of an image describing the Prize.
* ***extra*** (Object, optional) free form object containing additional information about the Prize.

Prize attribution is "first come, first served". When a User participates, the InstantWin will unlock the first Prize where the `available_at` date is lower that the current date. 

* If a Prize is available, it will be attributed to the User and cannot be attributed to anyone else afterwards.
* If no Prize is avilable at that time, the participation will be recorded as `lost`.

## InstantWins API and Implementation details

The InstantWin API is built on the [Achievements API](http://hull.io/docs/references/api#endpoint-achievements) and InstantWins are a specific type of [Achievement](http://hull.io/docs/references/api#endpoint-achievements-achievements).

### Object Model

![instant-win-schema](/docs/instant-win-schema.png)

InstantWins belong to a Hull App and can have several Prizes.
The User's participation on a specific InstantWin is recorded in a [Badge](http://hull.io/docs/references/api#endpoint-badges-badges).

The Badge is created on first participation and contains the current state of the User for this particular Achievement.

Here is an example of a "winning" badge : 

```javascript
{
  "id": "53a2bdfb8447189c650002e2",
  "updated_at": "2014-06-19T10:39:55Z",
  "created_at": "2014-06-19T10:39:55Z",
  "name": null,
  "description": null,
  "extra": {},
  "stats": {
    "attempts": 2
  },
  "tags": [],
  "picture": null,
  "type": "badge",
  "achievement_name": "My first instant",
  "achievement_id": "52f275153ca46e43dd000045",
  "user_id": "5103a7aa93e74e3a1f00001a",
  "achievement_type": "instant_win",
  "data": {
    "attempts": {
      "2014-06-19": "1403174395-b3509ee39abcf753"
    },
    "winner": true,
    "prize": {
      "id": "52f27574a3f4503f9f000c96",
      "updated_at": "2014-02-05 17:31:32 UTC",
      "created_at": "2014-02-05 17:31:32 UTC",
      "name": "A cool prize",
      "description": "The prize description",
      "extra": {},
      "stats": {},
      "tags": [],
      "picture": null,
      "type": "instant_win/prize",
      "user_id": "5103a7aa93e74e3a1f00001a",
      "badge_id": "53a2bdfb8447189c650002e2"
    },
  },
  "user" : { "... User Object Here ..." }
  }
}
```
* `data.attempts` lists all attempts made to unlock the Prize by the User
* `data.winner` contains a boolean that indicates whether it's a winning or a losing Badge
* `data.prize` contains the resulting Prize if the user won.

### Listing all InstantWins on the current Hull App

```javascript
Hull.api('app/achievements', { where: { _type: "InstantWin" } }, function(result) {
  console.log("Here are all the instant wins on my app ", result);
});
```

### Achieve, or record a User's participation

```javascript
var achievementId = '52f275153ca46e43dd000045';
Hull.api.post(achievementId + '/achieve', function(badge) {
  if (badge.data.winner) {
    alert("You won a " + badge.data.prize.name);
  } else {
    alert("Bummer, you have lost ! Come again tomorrow...");
  }
});
```

Please not that the current user MUST be logged in to do that.

### Get the current users' badge on this specific achievement

```javascript
var achievementId = '52f275153ca46e43dd000045';
Hull.api('me/badges/' + achievementId, function(badge) {
  if (badge && badge.data.winner) {
    alert("You won a " + badge.data.prize.name);
  } else if (badge) {
    alert("Bummer, you have lost ! Come again tomorrow...");
  } else {
    alert("Looks like you have never played... ");
  }
});
```

### Creating a new InstantWin (with admin credentials)

```javascript
var instant = {
  name: "My Super Achievement",
  description: "Click here to win a Prize !",
  type: "instant_win"
};

var prizes = [
  { available_at: '2014-06-19T13:34:02.439Z', name: "Prize 1", description: 'http://image.for/my/prize-1.jpg' },
  { available_at: '2014-06-19T15:30:05.439Z', name: "Prize 2", description: 'http://image.for/my/prize-2.jpg' }
];

Hull.api.post('app/achievements', instant, function(achievement) {
  console.log('Here is the instant win', achievement);
  // Adding some prizes now : 
  Hull.api.put(achievement.id + "/prizes", prizes, function(result) {
    console.log("ok, we now have some Prizes to win !", result);
  });
});
```


## Usage

To install this app locally and customize it, you need to clone this repo, install, and run [grunt](http://gruntjs.com/).

```
git clone https://github.com/hull-components/instant-win.git
cd intant-win
npm install -g grunt-cli
npm install
grunt --dev
open http://localhost:8000
```

The components will then be built in the 'dist/' folder.

All sources are inside the 'src/' folder.

