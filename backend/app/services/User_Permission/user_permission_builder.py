
class UserPermissionBuilder:
    """
    Class chuyển đổi dữ liệu phẳng (flat records) từ Database 
    thành danh sách User đã được gom nhóm kèm theo mảng userConfig (PermissionCode).
    """

    @staticmethod
    def build_user_permissions(raw_data: list[dict]) -> list[dict]:
        """
        Gom nhóm danh sách quyền theo UserId và loại bỏ trùng lặp PermissionCode.

        :param raw_data: List các dict đại diện cho từng bản ghi trả về từ SQL Query/ORM
        :return: List các dict thông tin user và danh sách permission unique
        """
        users_map = {}

        for row in raw_data:
            user_id = row.get("UserId")
            if user_id is None:
                continue

            # Nếu user chưa tồn tại trong map thì khởi tạo thông tin cơ bản
            if user_id not in users_map:
                users_map[user_id] = {
                    "userId": user_id,
                    "employeeCode": str(row.get("EmployeeCode", "")),
                    "userName": row.get("Username", ""),
                    "fullName": row.get("FullName", ""),
                    "email": row.get("Email", ""),
                    "department": row.get("DepartmentName", ""),
                    "roleName": row.get("RoleName", ""),
                    "userConfig": []
                }

            # Thêm PermissionCode vào mảng userConfig nếu chưa tồn tại
            perm_code = row.get("PermissionCode")
            if perm_code and perm_code not in users_map[user_id]["userConfig"]:
                users_map[user_id]["userConfig"].append(perm_code)

        return list(users_map.values())

    def build_permissions_list(self, raw_data: list[dict]) -> dict:
        roles_dict = {}
        permissions_dict = {}

        for row in raw_data:
            role_id = row.get("RoleId")
            role_name = row.get("RoleName")
            perm_code = row.get("PermissionCode")
            perm_name = row.get("PermissionName")
            perm_desc = row.get("PermissionDesc")

            # 1. Group permission codes by role
            role_key = (role_id, role_name)
            if role_key not in roles_dict:
                roles_dict[role_key] = []
            if perm_code and perm_code not in roles_dict[role_key]:
                roles_dict[role_key].append(perm_code)

            # 2. Build deduplicated permissions catalog
            if perm_code and perm_code not in permissions_dict:
                permissions_dict[perm_code] = {
                    "code": perm_code,
                    "name": perm_name,
                    "description": perm_desc,
                    "category": role_name,  # Assigns the role name as category, adjust if needed
                    "level": role_id,  # Default level, adjust if your data provides it
                }

        # Format rolePresets
        role_presets = [
            {"roleId": r_id, "label": r_name, "codes": codes}
            for (r_id, r_name), codes in roles_dict.items()
        ]

        # Format permissionsCatalog
        permissions_catalog = list(permissions_dict.values())

        return {"rolePresets": role_presets, "permissionsCatalog": permissions_catalog}
    
