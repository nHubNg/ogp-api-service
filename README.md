# Project

    Plateau state Open Government Partnership API Services

# Scaffolds

    - configs
        - cloudinary
        - db
        - mailer
        - multer
    - controllers
        - admin
        - analytics
        - auth
        - default
        - feeds
        - users
    - data
        - admin
        - feeds
    - middlewares
        - authVerifier
    - models
        - admin
        - feeds
        - users
    - routes
        - admin
        - analytics
        - auth
        - default
        - feeds
        - index
        - users
    - seeders
        - admin
        - feeds
    - utils
        - mail
        - mailings
    - validation
        - comment
        - feeds
        - isEmpty
        - login
        - objectId
        - register
    - app
    - server

# contributors

    - AS Muhammad
# Run

    - git clone https://github.com/nHub-Foundation/ogp_plateau_api_master.git
    - cd package.json
    - npm install
    - touch .env: create all neccessary environmental variables
    - npm run dev

# Collaborating via git

    #Creating a new branch:Two step method
    git branch <BRANCH_NAME>
    git checkout <BRANCH_NAME>

    #short cut
    git checkout -b NEW-BRANCH-NAME

    # View branches
    git branch

    #All both branches including origin
    git branch -a

    #switch to an existing branch
    git checkout <BRANCH_NAME>

    #Rename a Branch
    To rename a branch, run the command:

    git branch -m <OLD-BRANCH-NAME> <NEW-BRANCH-NAME> OR
    git branch --move OLD-BRANCH-NAME NEW-BRANCH-NAME

    #Delete a Branch
    ## Note
    Git won’t let you delete a branch that you’re currently on. You first need to checkout a different branch, then run the command:

    git branch -d <BRANCH-TO-DELETE>

## If you weren’t already on the branch you want to work on:

    git checkout <BRANCH_NAME>

# Pull from the remote branch

    git pull

# Merging via command line

    If you do not want to use the merge button or an automatic merge cannot be performed, you can perform a manual merge on the command line.

#### Step 1: From your project repository, bring in the changes and test.

    git fetch origin
    git checkout -b update origin/update
    git merge master

#### Step 2: Merge the changes and update on GitHub.

    git checkout master
    git merge --no-ff update
    git push origin master

# Track a Remote Branch

    If you already have a branch and you want to track a remote branch, then you use set-upstream-to command:

    git branch --set-upstream-to origin/<BRANCH_NAME>

    Or you can use the -u flag (upstream) when you make your first push:

    git push -u origin <BRANCH_NAME>
