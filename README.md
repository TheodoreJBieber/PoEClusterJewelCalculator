# PoE Cluster Jewel Calculator
PoE Cluser Jewel Calculator is a utility aimed at determining the possible notables you can roll on an optimal Large Cluster Jewel.
The scenario this is useful for is when you know you want 2 notables, but aren't sure what the third one can be so that your jewel is still optimal.
Typically, there are a few ways of testing this manually (such as using the trade site, or checking in PoB). 
But as you can imagine, checking manually can take a decent amount of time and gets pretty tedious.
Well, after about 16 hours of development, you no longer need to check manually. Just use this tool.

## Site
The site is located at https://theodorejbieber.github.io/PoEClusterJewelCalculator/

## Technical Explanation / How it works behind the scenes

### Notable Positions
Each notable has a number associated with it. 
For example, 
- Prodigious Defence = 1
- Smite the Weak 2
- Heavy Hitter = 3
- Martial Prowess = 4
- Feed the Fury = 5

The notables you want in the desired spots would be in the first and third positions, and the second position is the undesired one in the very back.
The position of notables on your cluster jewel is determined based on the numbers: the first position is the lowest, second is the middle, and third is the highest.
So, going back to the example... If you want to have Prodigious Defence and Feed the Fury as your desired notables, the notables that can appear in the second position are:
Smite the Weak, Heavy Hitter, and Martial Prowess.
The outcome if this example is real, but the numbers are not. In reality, these numbers are large and somewhat arbitrary (ie 11135). This is discussed in the Notables Data section.

### Notable compatibility
In addition to the number associated to notables, there are the typical rules for rolling jewels or items that are in play. The relevant ones are: 
- You are limited to 2 prefixes and 2 suffixes
- You can't have multiple mods in the same group
    - In the case of large cluster jewels, this manifests as a limit of 1 notable in the suffix, since the suffix notables all share the same mod group.
- Some notables can only roll on certain jewel base types
    - For example, Prodigious Defence can roll on 1 large cluster jewel type:
        - 12% increased Attack Damage while holding a Shield
    - And Sadist can roll on 4:
        - 10% increased Elemental Damage
        - 12% increased Fire Damage
        - 12% increased Lightning Damage
        - 12% increased Cold Damage
    - Since there's no common base type that both Sadist and Prodigious Defence can roll on, these cannot be rolled with each other
- Lastly, going back to the number associated with the notables; if there's no value between the desired notables, then it's impossible to have the two notables in optimal positions. An example of this from the example in the previous section is if you wanted Prodigious Defence and Smite the Weak. (Note: this is not really a valid example in reality because this would be a possible combination. A real example is with Snowstorm and Blanketed Snow).

### Notables Data
The data needed for calculating and displaying notables was taken from PoE Dat Viewer (https://snosme.github.io/poe-dat-viewer/)

I actually really don't want to go into much detail as to how all the data relates, so if you are curious check out my crappy python script https://github.com/TheodoreJBieber/PoEClusterJewelCalculator/blob/master/src/data/data_parser.py or my picture https://github.com/TheodoreJBieber/PoEClusterJewelCalculator/blob/master/src/data/data_relations.png

The numbers associated with each notable that are used to determine the position of them on the cluster jewel are IDs of the Stat used on the notable.

Currently, I don't know of a good way to get the enchantment descriptions for a given notable. 
I am mapping these out in the front end code in Calculator.js - using trial and error based on keywords in the descriptions from the official stats endpoint. This is barely better than doing it manually, and I wouldn't be surprised if it needs fixing at some point in the distant future.

### Trade Data
In order to generate the links to the official trade website, there are a few steps.
So, normally you could copy what they do and make a POST api call to their back end. However, I wanted this to be a purely front end site so I wouldn't have to pay for servers and I could just host it on github pages. 
But you can't make api calls to their back end from the browser because of CORS, which is enforced strictly in this case.
The solution I arrived at is just URL encoding the request body and passing it in as a url parameter, which is supported by the site thankfully. 
But I brainstormed quite a bit before my brother figured this out, so here are some honorable mentions:
- Use heroku free tier as a proxy, and make the requests through this and enforce rate limiting on the backend
- Since trade links last a while... Index all of the possible trade combinations and include that in a data file
    - You could do this for free using github actions, which can bypass rate limiting since it is done by IP
- Make a downloadable app instead
- Use a plugin to allow CORS requests (didn't work because it is strictly enforced) 

As for the request body, you need to generate filters based on what notables are selected, cluster jewel enchants, # of passives (always 8), and possible 2nd position notables.
But you can't just use the normal descriptions like "1 Added Passive Skill is Prodigious Defence" - there are ids behind the scenes you need to use. All this data is available at the stats endpoint: https://www.pathofexile.com/api/trade/data/stats
For mapping notable names to the trade id, it's fairly simple. The descriptions are all "1 Added Passive Skill is " + the notable name. So I map out the notable name to the description ez pz.
For mapping enchants (like "Added small passives also grant: 10% increased elemental damage") - I had to map the descriptions out with trial and error based on stat ids. It's not super reliable but it works for now.

## Feel free to take any code you want
Feel free to take anything from this project that you want to use. I don't mind.