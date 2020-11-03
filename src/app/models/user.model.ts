export class User {
    constructor(id?: string, userName?: string, fullName?: string, email?: string, jobTitle?: string, phoneNumber?: string, roles?: string[]) {

        this.Id = id;
        this.UserName = userName;
        this.FullName = fullName;
        this.Email = email;
        this.JobTitle = jobTitle;
        this.PhoneNumber = phoneNumber;
        this.Roles = roles;
    }


    get friendlyName(): string {
        let name = this.FullName || this.UserName;

        if (this.JobTitle)
            name = this.JobTitle + " " + name;

        return name;
    }


    public Id: string;
    public UserName: string;
    public FullName: string;
    public Email: string;
    public JobTitle: string;
    public PhoneNumber: string;
    public IsEnabled: boolean;
    public IsLockedOut: boolean;
    public Roles: string[];
}

