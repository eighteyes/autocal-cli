# AutoCal CLI
AutoCal is a markup language for describing actions, contexts, priorities and dependencies between actions in plaintext. AutoCal formatted files are designated with an `.acr` extension.  AutoCal CLI provides an easy interface for adding, editing and selecting actions from `.acr` files.

# Overview
Fundamental concepts in AutoCal are `Contexts` and `Activities`
- Contexts : Logical groups of activities, whether in the same project, phase or physical location.
- Activity : A single unit of work for prompting action.

## Selection
### Global
AutoCal CLI stores specified `.acr` files in `~/.autocal/`. This will be more suitable for usecases where you want to select from all your contexts when making an activity selection. AutoCal CLI operates in Global mode by default, unless you use `-f` to target a file. 

### Local
For selecting from a particular project, run `acal` with the `-f` option to point to a specific `.acr` file. 


# Examples
```
# List Plans
acal -p

# Add to local acr
acal add "do the thing" -f file.acr
```

# Development
After install run `npm link` to install the cm