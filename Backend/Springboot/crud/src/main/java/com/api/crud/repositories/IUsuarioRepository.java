package com.api.crud.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.api.crud.models.UsuarioModel;

@Repository

public interface IUsuarioRepository extends JpaRepository<UsuarioModel, Long> {

    Optional<UsuarioModel> findByUsuarioAndContrasena(String usuario, String contrasena);

    Optional<UsuarioModel> findByUsuario(String usuario);

    @Query(value = "Select Cod_verificacion from usuario where Id = ?1", nativeQuery = true)
    String findCodigoForId(Long id);

    List<UsuarioModel> findByEstado(boolean estado);

    List<UsuarioModel> findByActivo(boolean activo);

}
