import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { UUID } from 'angular2-uuid';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Address } from 'ish-core/models/address/address.model';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { Customer, CustomerRegistrationType } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { cancelRegistration, setRegistrationInfo } from 'ish-core/store/customer/sso-registration';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

export interface RegistrationConfigType {
  businessCustomer?: boolean;
  sso?: boolean;
  userId?: string;
}

@Injectable({ providedIn: 'root' })
export class RegistrationFormConfigurationService {
  // tslint:disable: no-intelligence-in-artifacts
  constructor(private accountFacade: AccountFacade, private store: Store, private router: Router) {}

  getRegistrationFormConfiguration(registrationConfig: RegistrationConfigType) {
    return [
      {
        type: 'ish-registration-heading-field',
        templateOptions: {
          headingSize: 'h1',
          heading: registrationConfig.sso ? 'account.register.complete_heading' : 'account.register.heading',
          subheading: 'account.register.message',
        },
      },
      ...(!registrationConfig.sso ? this.getCredentialsConfig() : []),
      ...(registrationConfig.businessCustomer ? this.getCompanyInfoConfig() : []),
      ...this.getPersonalInfoConfig(),
      {
        type: 'ish-registration-heading-field',
        templateOptions: {
          headingSize: 'h2',
          heading: 'account.register.address.headding',
          subheading: 'account.register.address.message',
          showRequiredInfo: true,
        },
      },
      {
        type: 'ish-fieldset-field',
        templateOptions: {
          fieldsetClass: 'row',
          childClass: 'col-md-10 col-lg-8 col-xl-6',
        },
        fieldGroup: [
          {
            type: 'ish-registration-address-field',
            templateOptions: {
              businessCustomer: registrationConfig.businessCustomer,
            },
          },
          {
            type: 'ish-registration-tac-field',
            key: 'termsAndConditions',
            templateOptions: {
              required: true,
            },
            validators: {
              validation: [Validators.pattern('true')],
            },
          },
          {
            type: 'ish-captcha-field',
            templateOptions: {
              topic: 'register',
            },
          },
        ],
      },
    ];
  }

  getRegistrationFormConfigurationOptions(
    registrationConfig: RegistrationConfigType,
    model: Record<string, unknown>
  ): FormlyFormOptions {
    if (registrationConfig.sso) {
      return { formState: { disabled: Object.keys(model) } };
    } else {
      return {};
    }
  }

  submitRegistrationForm(form: FormGroup, registrationConfig: RegistrationConfigType, model?: Record<string, unknown>) {
    const formValue = { ...form.value, ...model };

    const address: Address = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      ...formValue.address,
      phoneHome: formValue.phoneHome,
    };

    if (registrationConfig.sso && registrationConfig.userId) {
      this.store.dispatch(
        setRegistrationInfo({
          companyInfo: {
            companyName1: formValue.companyName1,
            companyName2: formValue.companyName2,
            taxationID: formValue.taxationID,
          },
          address,
          userId: registrationConfig.userId,
        })
      );
    } else {
      const customer: Customer = {
        isBusinessCustomer: false,
        customerNo: UUID.UUID(), // TODO: customerNo should be generated by the server - IS-24884
      };

      const user: User = {
        title: formValue.title,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.login,
        phoneHome: formValue.phoneHome,
        birthday: formValue.birthday === '' ? undefined : formValue.birthday, // TODO: see IS-22276
      };

      const credentials: Credentials = {
        login: formValue.login,
        password: formValue.password,
      };

      if (registrationConfig.businessCustomer) {
        customer.isBusinessCustomer = true;
        customer.companyName = formValue.companyName1;
        customer.companyName2 = formValue.companyName2;
        customer.taxationID = formValue.taxationID;
        user.businessPartnerNo = 'U' + customer.customerNo;
      }

      const registration: CustomerRegistrationType = { customer, user, credentials, address };
      registration.captcha = form.get('captcha').value;
      registration.captchaAction = form.get('captchaAction').value;

      this.accountFacade.createUser(registration);
    }
  }

  cancelRegistrationForm(config: RegistrationConfigType): void {
    config.sso ? this.store.dispatch(cancelRegistration()) : this.router.navigate(['/home']);
  }

  private getCredentialsConfig(): FormlyFieldConfig[] {
    return [
      {
        type: 'ish-registration-heading-field',

        templateOptions: {
          headingSize: 'h2',
          heading: 'account.register.email_password.heading',
          subheading: 'account.register.email_password.message',
          showRequiredInfo: true,
        },
      },
      {
        type: 'ish-fieldset-field',
        templateOptions: {
          fieldsetClass: 'row',
          childClass: 'col-md-10 col-lg-8 col-xl-6',
        },
        fieldGroup: [
          {
            key: 'login',
            type: 'ish-email-field',
            templateOptions: {
              label: 'account.register.email.label',
              required: true,
            },
            validation: {
              messages: {
                required: 'account.update_email.email.error.notempty',
              },
            },
          },
          {
            key: 'loginConfirmation',
            type: 'ish-email-field',
            templateOptions: {
              label: 'account.register.email_confirmation.label',
              required: true,
            },
            validators: {
              validation: [SpecialValidators.equalToControl('login')],
            },
            validation: {
              messages: {
                required: 'account.update_email.email.error.notempty',
                equalTo: 'account.registration.email.not_match.error',
              },
            },
          },

          {
            key: 'password',
            type: 'ish-password-field',
            templateOptions: {
              postWrappers: ['description'],
              required: true,
              label: 'account.register.password.label',
              customDescription: {
                class: 'input-help',
                key: 'account.register.password.extrainfo.message',
                args: { 0: '7' },
              },

              autocomplete: 'new-password',
            },
            validation: {
              messages: {
                required: 'account.update_password.new_password.error.required',
              },
            },
          },
          {
            key: 'passwordConfirmation',
            type: 'ish-password-field',
            templateOptions: {
              required: true,
              label: 'account.register.password_confirmation.label',

              autocomplete: 'new-password',
            },
            validators: {
              validation: [SpecialValidators.equalToControl('password')],
            },
            validation: {
              messages: {
                required: 'account.register.password_confirmation.error.default',
                equalTo: 'account.update_password.confirm_password.error.stringcompare',
              },
            },
          },
        ],
      },
    ];
  }

  private getPersonalInfoConfig(): FormlyFieldConfig[] {
    return [
      {
        type: 'ish-registration-heading-field',
        templateOptions: {
          headingSize: 'h2',
          heading: 'account.register.personal_information.heading',
          showRequiredInfo: true,
        },
      },
      {
        type: 'ish-fieldset-field',
        templateOptions: {
          fieldsetClass: 'row',
          childClass: 'col-md-10 col-lg-8 col-xl-6',
        },
        fieldGroup: [
          {
            key: 'firstName',
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.default_address.firstname.label',
              required: true,
            },
            validators: {
              validation: [SpecialValidators.noSpecialChars],
            },
            validation: {
              messages: {
                required: 'account.address.firstname.missing.error',
                noSpecialChars: 'account.name.error.forbidden.chars',
              },
            },
          },
          {
            key: 'lastName',
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.default_address.lastname.label',
              required: true,
            },
            validators: {
              validation: [SpecialValidators.noSpecialChars],
            },
            validation: {
              messages: {
                required: 'account.address.lastname.missing.error',
                noSpecialChars: 'account.name.error.forbidden.chars',
              },
            },
          },
          {
            key: 'phoneHome',
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.profile.phone.label',
              required: false,
            },
          },
        ],
      },
    ];
  }

  private getCompanyInfoConfig(): FormlyFieldConfig[] {
    return [
      {
        type: 'ish-registration-heading-field',
        templateOptions: {
          headingSize: 'h2',
          heading: 'Company Information',
          showRequiredInfo: true,
        },
      },
      {
        type: 'ish-fieldset-field',
        templateOptions: {
          fieldsetClass: 'row',
          childClass: 'col-md-10 col-lg-8 col-xl-6',
        },
        fieldGroup: [
          {
            key: 'companyName1',
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.address.company_name.label',
              required: true,
            },
            validation: {
              messages: {
                required: 'account.address.company_name.error.required',
              },
            },
          },
          {
            key: 'companyName2',
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.address.company_name_2.label',
              required: false,
            },
          },
          {
            key: 'taxationID',
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.address.taxation.label',
            },
          },
        ],
      },
    ];
  }
}
