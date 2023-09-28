import {Profile} from '../models/profiles';

export class User {
    id;
    username;
    password;
    passwordConfirm;
    email;
    profile: Profile | null;
    state;
    lastAccess;
    lastPasswordChange;
    firstName;
    secondName;
    lastName;
    secondLastName;
    profileId;
    userCreator;
    cellPhone;
    canUpdateEmail;
    canUpdateCellPhone;
    temporalPassword;
    generatePassword;
    constructor(id, firstName, secondName, lastName, secondLastName, username, password, email, profile, lastPasswordChange, lastAccess, state, cellPhone,temporalPassword,generatePassword) {
        this.id = id;
        this.firstName = firstName;
        this.secondName = secondName;
        this.lastName = lastName;
        this.secondLastName = secondLastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.profile = profile;
        this.lastPasswordChange = lastPasswordChange;
        this.lastAccess = lastAccess;
        this.state = state;
        this.cellPhone = cellPhone;
        this.temporalPassword = temporalPassword;
        this.generatePassword = generatePassword;
    }
}
