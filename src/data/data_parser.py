import json

# Script to parse data from ./raw directory and write it to a nicer format
input_path = "src/data/raw/"
ext = ".json"
files = ["BaseItemTypes", # 0
    "Mods", # 1
    "PassiveSkills", # 2
    "PassiveTreeExpansionJewels", # 3
    "PassiveTreeExpansionJewelSizes", # 4
    "PassiveTreeExpansionSkills", # 5
    "PassiveTreeExpansionSpecialSkills", # 6
    "Stats", # 7
    "Tags", # 8
    "trade_stats" # 9
    ]

file_json = {}
out_json = {}

output_file = "src/data/data.json"

def main():
    print("Starting data read")
    load_data()
    parse_data()
    print("Data read")
    print("Starting data write")
    write_data()
    print("Data wrote")

def load_data():
    for name in files:
        fullpath = input_path + name + ext
        with open(fullpath) as json_file:
            data = json.load(json_file)
            file_json[name] = data

def parse_data():
    trade_stats = file_json["trade_stats"]
    wanted = ["Explicit", "Enchant"]
    for trade_stat in trade_stats["result"]:
        if (trade_stat["label"] in wanted):
            add_trade_stats_data(trade_stat)
    special_skills = file_json["PassiveTreeExpansionSpecialSkills"]
    passive_skills = file_json["PassiveSkills"]
    stats = file_json["Stats"]
    tags = file_json["Tags"]
    sizes = file_json["PassiveTreeExpansionJewelSizes"]
    for skill in special_skills:
        passive_skill_key = skill["PassiveSkillsKey"]
        passive_skill = get(passive_skills, passive_skill_key)
        stats_key = skill["StatsKey"]
        stat = get(stats, stats_key)
        try:
            mod = get_mod_with_stat(stat)
        except:
            print("Could not find mod for stat:" + stat["Id"])
            continue
        for spawn_tag_id in mod["SpawnWeight_TagsKeys"]:
            if spawn_tag_id == 0:
                continue
            tag = get(tags, spawn_tag_id)
            expansion_skills = get_expansion_skills_with_tag(tag)
            if len(expansion_skills) > 0:
                size_key = expansion_skills[0]["PassiveTreeExpansionJewelSizesKey"]
                # if there's ever a case where the size is different then the code needs fixin
                for es in expansion_skills:
                    if es["PassiveTreeExpansionJewelSizesKey"] != size_key:
                        raise Exception("New data has conflicting size on shared tag. Update code to handle this")
                
                size = get(sizes, size_key)
                add_notables_data(skill, passive_skill, stat, mod, tag, expansion_skills, size)
            else:
                print("Could not find expansion skill for tag:" + str(spawn_tag_id))

def write_data():
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(out_json, f, ensure_ascii=False, indent=4)

def add_notables_data(skill, passive_skill, stat, mod, tag, expansion_skills, size):
    if "Notables" not in out_json:
        out_json["Notables"] = {}
    notables = out_json["Notables"]
    size_name = size["Name"]
    if size_name not in notables:
        notables[size_name] = {}
    size_notables = notables[size_name]
    ps = extract_passive_skill(passive_skill)
    ps_name = ps["Name"]
    if ps_name not in size_notables:
        size_notables[ps_name] = {}
        size_notables[ps_name]["PassiveSkill"] = ps
        size_notables[ps_name]["Stat"] = extract_stat(stat)
        size_notables[ps_name]["Enchantments"] = []
    notable = size_notables[ps_name]
    notable["Mod"] = extract_mod(mod)
    notable["Enchantments"].append(extract_enchantments(expansion_skills))
    

def add_trade_stats_data(trade_stat):
    if "TradeStats" not in out_json:
        out_json["TradeStats"] = {}
    trade_stats = out_json["TradeStats"]
    label = trade_stat["label"]
    if label == "Explicit":
        oap = "1 Added Passive Skill is "
        explicit = {}
        for entry in trade_stat["entries"]:
            text = entry["text"]
            if text.startswith(oap):
                text_key = text[len(oap):]
                explicit[text_key] = entry["id"]
        trade_stats[label] = explicit
    elif label == "Enchant":
        wanted = ["Adds # Passive Skills", "Added Small Passive Skills grant: #"]
        enchant = {}
        for entry in trade_stat["entries"]:
            text = entry["text"]
            if text in wanted:
                enchant[text] = entry
        trade_stats[label] = enchant

def extract_passive_skill(passive_skill):
    carryover = ["Name"]
    out = extract_as_is(passive_skill, carryover)
    out["Stats"] = []
    stats = file_json["Stats"]
    stat_index = 1
    for stat_key in passive_skill["Stats"]:
        stat = get(file_json["Stats"], stat_key)
        value_key = "Stat" + str(stat_index) + "Value"
        value = passive_skill[value_key]
        out["Stats"].append(extract_stat(stat, value))
        stat_index = stat_index + 1
    return out

def extract_stat(stat, value = None):
    carryover = ["_rid", "Text"]
    out = extract_as_is(stat, carryover)
    if (value == None):
        desc = {}
        desc["Description"] = stat["Id"]
        out["Description"] = desc
    else:
        desc = {}
        desc["Description"] = stat["Id"]
        desc["Value"] = value
        out["Description"] = desc
    return out

def extract_mod(mod):
    carryover = ["CorrectGroup", "Level"]
    out = extract_as_is(mod, carryover)
    return out

def extract_enchantments(expansion_skills):
    ench_lines = []

    for es in expansion_skills:
        ps_key = es["PassiveSkillsKey"]
        ps = extract_passive_skill(get(file_json["PassiveSkills"], ps_key))
        for stat in ps["Stats"]:
            ench_lines.append(stat["Description"])

    return ench_lines

def extract_as_is(original, keys):
    out = {}
    for key in keys:
        out[key] = original[key]
    return out

def get(obj, id):
    if obj is None:
        raise Exception("obj is None")
    if id is None:
        raise Exception("id is None")
    for e in obj:
        if e['_rid'] == id:
            return e
    raise Exception("Could not find obj with _rid=" + str(id))

def get_mod_with_stat(stat):
    if stat is None:
        raise Exception("stat is None")
    rid = stat["_rid"]
    if rid is None:
        raise Exception("rid is None")
    for m in file_json["Mods"]:
        if m["StatsKey1"] == rid:
            return m
    raise Exception("Could not find mod with stat _rid=" + str(rid))

def get_expansion_skills_with_tag(tag):
    if tag is None:
        raise Exception("tag is None")
    rid = tag["_rid"]
    if rid is None:
        raise Exception("rid is None")
    out = []
    for es in file_json["PassiveTreeExpansionSkills"]:
        if es["TagsKey"] == rid:
            out.append(es)
    return out


if __name__ == "__main__":
    main()