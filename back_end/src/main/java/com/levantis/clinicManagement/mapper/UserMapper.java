package com.levantis.clinicManagement.mapper;

import com.levantis.clinicManagement.dto.SignUpDTO;
import com.levantis.clinicManagement.dto.UserDTO;
import com.levantis.clinicManagement.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "string")
public interface UserMapper {

    UserDTO toUserDTO(User user);

    @Mapping(target = "password", ignore = true)
    User signUpToUser(SignUpDTO signUpDTO);

}
