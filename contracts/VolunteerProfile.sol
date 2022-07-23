// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VolunteerProfile {
    struct Profile {
        string name;
        string email;
        string phone;
        string birthDate;
        address account;
    }

    struct ProfileWrapper {
        Profile profile;
        bool flag;
    }

    event editorAccessUpdated(
        address editor,
        bool access
    );

    event profileAdded(
        Profile profile,
        address addedBy
    );
    event profileUpdated(
        Profile previousProfile,
        Profile newProfile,
        address updatedBy
    );

    address public owner;

    mapping(address => ProfileWrapper) public addressToProfile;
    mapping(address => bool) addressToEditor;

    modifier onlyOwner {
        if (msg.sender != owner) {
            revert('Only owner can access.');
        }
        _;
    }

    modifier onlyOwnerOrEditor {
        if (msg.sender != owner && !addressToEditor[msg.sender]) {
            revert('Only owner or editor can access.');
        }
        _;
    }

    modifier onlyOnce {
        if (addressToProfile[msg.sender].flag == true) {
            revert('Profile already exists.');
        }
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addEditorAccess(address editor) public onlyOwner {
        addressToEditor[editor] = true;
        emit editorAccessUpdated(editor, true);
    }

    function removeEditorAccess(address editor) public onlyOwner {
        addressToEditor[editor] = false;
        emit editorAccessUpdated(editor, false);
    }

    function addProfile(Profile memory profile) public onlyOwnerOrEditor onlyOnce {
        ProfileWrapper memory profileWrapper;
        profileWrapper.profile = profile;
        profileWrapper.flag = true;

        addressToProfile[profile.account] = profileWrapper;
        emit profileAdded(profile, msg.sender);
    }

    function updateProfile(Profile memory profile) public onlyOwner {
        ProfileWrapper memory previousProfileWrapper = addressToProfile[profile.account];

        if (previousProfileWrapper.flag == true) {
            Profile memory previousProfile = previousProfileWrapper.profile;
            addressToProfile[profile.account].profile = profile;
            emit profileUpdated(previousProfile, profile, msg.sender);
        } else {
            revert('Profile does not exist.');
        }
    }

    function getProfile(address volunteerAddress) public view returns (Profile memory) {
        return addressToProfile[volunteerAddress].profile;
    }
}
