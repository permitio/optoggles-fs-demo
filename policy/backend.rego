package app.backend

default allow := false

allow if {
    is_allowed_by_role(input.user,input.action,input.resource)
}

is_allowed_by_role(user,action,resource) {
    # for each role assigned to the user
    some role in data.users[user].roles
    # for each grant in that role
    some grant in data.role_permissions[role]
    # if the grant matches the action and resource
    grant.action == action
    grant.resource == resource
}


