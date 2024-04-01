package app.frontend

import future.keywords.in
import data.app.backend


billing_users[user] {
    # for each user
    some user,_ in data.users
    # check if the user is allowed to read the billing data
    backend.is_allowed_by_role(user,"read","finance")
    # if so, add the user to the billing_users set
}

us_users[user] {
    # for each user
    some user,_ in data.users
    # check if the user is from the US ( has the location.country field set to "US")
    user.location.country == "US"
    # if so, add the user to the us_users set
}