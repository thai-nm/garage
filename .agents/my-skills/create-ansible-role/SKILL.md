---
name: create-ansible-role
description: Create a new Ansible role with proper structure following project conventions
---

# Create Ansible Role

Creates a new Ansible role in the `ansible/roles/` directory following the project's established conventions.

## Project Structure
```
ansible/
├── ansible.cfg
├── inventory.ini
├── docs/
│   └── ROLE_<ROLE_NAME>.md
├── playbooks/
│   └── *.yml
└── roles/
    └── <role_name>/
        ├── tasks/
        │   └── main.yml
        ├── handlers/
        │   └── main.yml (optional)
        ├── defaults/
        │   └── main.yml (optional)
        ├── vars/
        │   └── main.yml (optional)
        ├── templates/ (optional)
        ├── files/ (optional)
        └── meta/
            └── main.yml (optional)
```

## Implementation Steps

1. **Validate Input**
   - Ensure role name is provided
   - Check role name follows Ansible naming conventions (lowercase, underscores allowed)
   - Verify role doesn't already exist

2. **Create Role Directory Structure**
   - Create `ansible/roles/<role_name>/`
   - Create `tasks/` subdirectory (required)
   - Create `handlers/` subdirectory
   - Create `defaults/` subdirectory
   - Create `vars/` subdirectory

3. **Create Required Files**
   - Create `tasks/main.yml` with template:
     ```yaml
     ---
     # Tasks for <role_name> role
     - name: Example task
       debug:
         msg: "Configure your tasks here"
     ```

4. **Create Optional Placeholder Files** (based on user needs)
   - `handlers/main.yml`:
     ```yaml
     ---
     # Handlers for <role_name> role
     ```

   - `defaults/main.yml`:
     ```yaml
     ---
     # Default variables for <role_name> role
     ```

   - `vars/main.yml`:
     ```yaml
     ---
     # Variables for <role_name> role
     ```

5. **Ask User About Additional Components**
  - Templates needed? Create `templates/` directory
  - Files needed? Create `files/` directory
  - Meta info needed? Create `meta/main.yml`

6. **Create Documentation**
  - Create `ansible/docs/ROLE_<ROLE_NAME>.md` with template:
    ```markdown
    # <Role Name> Ansible Role

    <Description of the role>

    ## Directory Structure
    - `defaults/main.yml`: Default configuration variables.
    - `tasks/main.yml`: Implementation logic.

    ## Variables
    | Variable | Default | Description |
    |----------|---------|-------------|
    | `variable_name` | `default_value` | Description |

    ## Usage
    ### 1. Create a playbook
    ```yaml
    ---
    - name: Use <role_name>
      hosts: all
      become: true
      roles:
        - <role_name>
    ```
    ```

7. **Create Example Playbook** (optional)
   - Offer to create a playbook in `playbooks/<role_name>.yml`:
     ```yaml
     ---
     - name: Deploy <role_name>
       hosts: all
       become: true
       roles:
         - <role_name>
     ```

8. **Summary**
  - Display created directory structure
  - Show next steps (edit tasks, configure variables, etc.)
  - Suggest testing command: `ansible-playbook playbooks/<role_name>.yml`

## Usage Examples

```bash
# Create a basic role
create-ansible-role nginx

# Create a role for MySQL
create-ansible-role mysql

# Create a role for security hardening
create-ansible-role security_hardening
```

## Validation Rules

- Role name must be lowercase with underscores (no hyphens, spaces, or special chars)
- Role directory must not already exist
- Must be run from the ansible project root or handle paths correctly

## Best Practices

- Follow existing role structure (like the `docker` role)
- Use meaningful task names with `name:` attribute
- Keep tasks idempotent
- Use variables for configurable values (in defaults/)
- Document role purpose in comments
- Test role with check mode: `ansible-playbook --check playbooks/<role_name>.yml`
